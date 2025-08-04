const db = require("../config/db");
const moment = require("moment");

const getBuyerReceivables = (req, res) => {
  const query = `
    SELECT 
        b.id AS buyerId,
        b.name AS buyerName,
        COALESCE(SUM(bi.amount), 0) AS totalBuyerPayable,
        COALESCE(SUM(paidSub.paidAmount), 0) AS totalPayments,
        COALESCE(SUM(bi.amount) - SUM(paidSub.paidAmount), 0) AS remainingDue,
        COALESCE(od.overdue_due, 0) AS overdueDue,
        COALESCE(od.oldest_due_date, NULL) AS oldestDueDate,
        COALESCE(ds.due_soon_due, 0) AS dueSoonDue,
        COALESCE(ds.next_due_date, NULL) AS nextDueDate
    FROM buyers b
    LEFT JOIN sales s ON s.buyer_id = b.id
    LEFT JOIN buyer_installments bi ON bi.sale_id = s.id
    LEFT JOIN (
      SELECT buyer_installment_id, SUM(amount) AS paidAmount
      FROM buyer_payment_installments
      GROUP BY buyer_installment_id
    ) paidSub ON paidSub.buyer_installment_id = bi.id

    LEFT JOIN (
        SELECT s.buyer_id,
               SUM(i.amount) AS overdue_due,
               MIN(i.due_date) AS oldest_due_date
        FROM buyer_installments i
        JOIN sales s ON s.id = i.sale_id
        LEFT JOIN (
          SELECT buyer_installment_id, SUM(amount) AS paid
          FROM buyer_payment_installments
          GROUP BY buyer_installment_id
        ) paid ON paid.buyer_installment_id = i.id
        WHERE i.due_date < CURDATE() AND COALESCE(paid.paid, 0) < i.amount
        GROUP BY s.buyer_id
    ) od ON od.buyer_id = b.id

    LEFT JOIN (
        SELECT s.buyer_id,
               SUM(i.amount) AS due_soon_due,
               MIN(i.due_date) AS next_due_date
        FROM buyer_installments i
        JOIN sales s ON s.id = i.sale_id
        LEFT JOIN (
          SELECT buyer_installment_id, SUM(amount) AS paid
          FROM buyer_payment_installments
          GROUP BY buyer_installment_id
        ) paid ON paid.buyer_installment_id = i.id
        WHERE i.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
          AND COALESCE(paid.paid, 0) < i.amount
        GROUP BY s.buyer_id
    ) ds ON ds.buyer_id = b.id

    GROUP BY b.id
    HAVING remainingDue > 0
    ORDER BY b.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching accurate buyer receivables:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    const receivables = results.map((row) => ({
      buyerId: row.buyerId,
      buyerName: row.buyerName,
      totalBuyerPayable: parseFloat(row.totalBuyerPayable),
      totalPayments: parseFloat(row.totalPayments),
      remainingDue: parseFloat(row.remainingDue),
      overdueDue: parseFloat(row.overdueDue),
      dueSoonDue: parseFloat(row.dueSoonDue),
      oldestDueDate: row.oldestDueDate,
      nextDueDate: row.nextDueDate
    }));

    res.status(200).json(receivables);
  });
};


const AddPayment = (req, res) => {
  let {
    buyerId,
    amount,
    paymentDate,
    installments = [],
    paymentMode,
    bankAccountId,
    referenceNo,
    proofFileUrl,
    notes,
  } = req.body;

  if (!buyerId || !amount || !paymentDate || !paymentMode) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  installments = installments.map((i) => {
    if (typeof i === "number") {
      return { id: i, amount: null };
    } else if (typeof i === "object" && i !== null && i.id !== undefined) {
      return {
        id: parseInt(i.id),
        amount: i.amount ?? null,
      };
    } else {
      return null;
    }
  }).filter(Boolean);

  const sanitize = (values) => {
    return values.map(v => v === undefined ? null : v);
  };

  const insertPaymentSql = `
    INSERT INTO buyer_payments (
      buyer_id, amount, date, payment_mode,
      bank_account_id, reference_no, proof_file_url, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const insertValues = sanitize([
    buyerId,
    amount,
    paymentDate,
    paymentMode,
    bankAccountId,
    referenceNo,
    proofFileUrl,
    notes,
  ]);

  db.execute(insertPaymentSql, insertValues, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Failed to add payment" });
    }

    const paymentId = result.insertId;
    let remainingAmount = amount;

    const fetchInstallmentsIfNeeded = (callback) => {
      if (installments.length > 0) {
        return callback(installments);
      }

      const fetchPendingSql = `
        SELECT bi.id, bi.amount 
        FROM buyer_installments AS bi
        JOIN sales AS s ON bi.sale_id = s.id
        WHERE s.buyer_id = ? AND bi.status != 'paid'
        ORDER BY bi.due_date ASC
      `;

      db.execute(fetchPendingSql, [buyerId], (fetchErr, rows) => {
        if (fetchErr) {
          return res.status(500).json({
            success: false,
            message: "Failed to fetch installments for auto-distribution",
          });
        }

        const pendingInstallments = rows.map((row) => ({
          id: row.id,
          amount: parseFloat(row.amount),
        }));

        callback(pendingInstallments);
      });
    };

    fetchInstallmentsIfNeeded((list) => {
      const processInstallments = (index) => {
        if (index >= list.length || remainingAmount <= 0) {
          return res.status(201).json({
            success: true,
            message: "Payment added and distributed across installments",
            paymentId,
          });
        }

        const { id: installmentId, amount: knownAmount } = list[index];

        const getInstallmentAmount = (callback) => {
          if (knownAmount !== null) return callback(knownAmount);

          db.execute(
            "SELECT amount FROM buyer_installments WHERE id = ?",
            [installmentId],
            (err, [row]) => {
              if (err || !row) return callback(null);
              callback(parseFloat(row.amount));
            }
          );
        };

        getInstallmentAmount((installmentAmount) => {
          if (installmentAmount === null) {
            return processInstallments(index + 1);
          }

          db.execute(
            "SELECT SUM(amount) AS totalPaid FROM buyer_payment_installments WHERE buyer_installment_id = ?",
            [installmentId],
            (sumErr, [sumRow]) => {
              if (sumErr) {
                return processInstallments(index + 1);
              }

              const totalPaid = parseFloat(sumRow.totalPaid || 0);
              const remainingInstallmentAmount = installmentAmount - totalPaid;

              if (remainingInstallmentAmount <= 0) {
                return processInstallments(index + 1);
              }

              const appliedAmount = Math.min(remainingAmount, remainingInstallmentAmount);

              db.execute(
                `INSERT INTO buyer_payment_installments (buyer_payment_id, buyer_installment_id, amount) VALUES (?, ?, ?)`,
                [paymentId, installmentId, appliedAmount],
                (linkErr) => {
                  if (linkErr) {
                    return processInstallments(index + 1);
                  }

                  const newTotalPaid = totalPaid + appliedAmount;
                  let newStatus = "pending";
                  if (newTotalPaid >= installmentAmount) newStatus = "paid";
                  else if (newTotalPaid > 0) newStatus = "partial";

                  db.execute(
                    `UPDATE buyer_installments SET status = ? WHERE id = ?`,
                    [newStatus, installmentId],
                    (updateErr) => {
                      remainingAmount -= appliedAmount;
                      processInstallments(index + 1);
                    }
                  );
                }
              );
            }
          );
        });
      };

      processInstallments(0);
    });
  });
};



const getBuyerReceivableCard = (req, res) => {
  console.log("FULL REQUEST PARAMS:", req.params);
  const buyerId = req.params.buyerId;

  if (!buyerId) {
    return res.status(400).json({ error: "Buyer ID is required" });
  }

  // 1. Get buyer info
  const buyerInfoQuery = `
    SELECT 
      b.id,
      b.name,
      IFNULL(b.address, 'N/A') AS address,
      b.notes
    FROM buyers b
    WHERE b.id = ?
  `;

  db.query(buyerInfoQuery, [buyerId], (err, buyerRows) => {
    if (err) {
      console.error("Error fetching buyer info:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (buyerRows.length === 0) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    const buyer = buyerRows[0];

    // 2. Fetch all phone numbers for buyer
    const phoneQuery = `
      SELECT phone_number 
      FROM buyer_contacts 
      WHERE buyer_id = ?
    `;

    db.query(phoneQuery, [buyerId], (err, phoneRows) => {
      if (err) {
        console.error("Error fetching phone numbers:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const phoneNumbers = phoneRows.map(row => row.phone_number);
      const phone = phoneNumbers.join(', ') || "N/A";

      // 3. Get unpaid installments (with accurate paidAmount using subquery)
      const installmentsQuery = `
        SELECT 
          bi.id,
          s.id AS invoice_no,
          s.crop,
          bi.amount,
          COALESCE(paidSub.paidAmount, 0) AS paidAmount,
          DATE_FORMAT(bi.due_date, '%d-%b-%Y') AS dueDate,
          CASE 
            WHEN COALESCE(paidSub.paidAmount, 0) = 0 THEN 'Pending'
            WHEN COALESCE(paidSub.paidAmount, 0) >= bi.amount THEN 'Paid'
            ELSE 'Partial'
          END AS status
        FROM buyer_installments bi
        INNER JOIN sales s ON s.id = bi.sale_id
        LEFT JOIN (
          SELECT buyer_installment_id, SUM(amount) AS paidAmount
          FROM buyer_payment_installments
          GROUP BY buyer_installment_id
        ) paidSub ON paidSub.buyer_installment_id = bi.id
        WHERE s.buyer_id = ?
      `;

      db.query(installmentsQuery, [buyerId], (err, installmentRows) => {
        if (err) {
          console.error("Error fetching installments:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        // 4. Get payment history
        const paymentsQuery = `
          SELECT 
            bp.id,
            DATE_FORMAT(MAX(bp.date), '%d-%b-%Y') AS date,
            MAX(bp.amount) AS amount,
            MAX(bp.payment_mode) AS mode,
            MAX(a.bank) AS bank,
            MAX(bp.reference_no) AS refNo,
            MAX(s.id) AS invoice_no,
            MAX(bp.notes) AS notes
          FROM buyer_payments bp
          LEFT JOIN accounts a ON bp.bank_account_id = a.id
          LEFT JOIN buyer_payment_installments bpi ON bpi.buyer_payment_id = bp.id
          LEFT JOIN buyer_installments bi ON bpi.buyer_installment_id = bi.id
          LEFT JOIN sales s ON bi.sale_id = s.id
          WHERE bp.buyer_id = ?
          GROUP BY bp.id
          ORDER BY bp.date DESC
        `;

        db.query(paymentsQuery, [buyerId], (err, paymentRows) => {
          if (err) {
            console.error("Error fetching payments:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          // ✅ Accurate unpaid calculation
          const totalUnpaid = installmentRows.reduce((sum, row) => {
            const unpaid = parseFloat(row.amount) - parseFloat(row.paidAmount || 0);
            return sum + (unpaid > 0 ? unpaid : 0);
          }, 0);

          return res.json({
            name: buyer.name,
            address: buyer.address,
            phone,
            mobile: "N/A", 
            totalUnpaid,
            unpaidInstallments: installmentRows,
            payments: paymentRows
          });
        });
      });
    });
  });
};


// const getBuyerReceivableCard = (req, res) => {
//   console.log("FULL REQUEST PARAMS:", req.params);
//   const buyerId = req.params.buyerId;

//   if (!buyerId) {
//     return res.status(400).json({ error: "Buyer ID is required" });
//   }

//   // 1. Get buyer info (without joining buyer_contacts)
//   const buyerInfoQuery = `
//     SELECT 
//       b.id,
//       b.name,
//       IFNULL(b.address, 'N/A') AS address,
//       b.notes
//     FROM buyers b
//     WHERE b.id = ?
//   `;

//   db.query(buyerInfoQuery, [buyerId], (err, buyerRows) => {
//     if (err) {
//       console.error("Error fetching buyer info:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     if (buyerRows.length === 0) {
//       return res.status(404).json({ error: "Buyer not found" });
//     }

//     const buyer = buyerRows[0];

//     // 2. Fetch all phone numbers for buyer
//     const phoneQuery = `
//       SELECT phone_number 
//       FROM buyer_contacts 
//       WHERE buyer_id = ?
//     `;

//     db.query(phoneQuery, [buyerId], (err, phoneRows) => {
//       if (err) {
//         console.error("Error fetching phone numbers:", err);
//         return res.status(500).json({ error: "Internal server error" });
//       }

//       const phoneNumbers = phoneRows.map(row => row.phone_number);
//       const phone = phoneNumbers.join(', ') || "N/A";

//       // 3. Get unpaid installments
//       const installmentsQuery = `
// SELECT 
//   bi.id,
//   s.id AS invoice_no,
//   s.crop,
//   bi.amount,
//   COALESCE(SUM(bpi.amount), 0) AS paidAmount,
//   DATE_FORMAT(bi.due_date, '%d-%b-%Y') AS dueDate,
//   CASE 
//     WHEN COALESCE(SUM(bpi.amount), 0) = 0 THEN 'Pending'
//     WHEN COALESCE(SUM(bpi.amount), 0) >= bi.amount THEN 'Paid'
//     ELSE 'Partial'
//   END AS status
// FROM buyer_installments bi
// INNER JOIN sales s ON s.id = bi.sale_id
// LEFT JOIN buyer_payment_installments bpi ON bpi.buyer_installment_id = bi.id
// WHERE s.buyer_id = ?
// GROUP BY bi.id

//       `;

//       db.query(installmentsQuery, [buyerId], (err, installmentRows) => {
//         if (err) {
//           console.error("Error fetching installments:", err);
//           return res.status(500).json({ error: "Internal server error" });
//         }

//         // 4. Get payment history
//         const paymentsQuery = `
//           SELECT 
//             bp.id,
//             DATE_FORMAT(MAX(bp.date), '%d-%b-%Y') AS date,
//             MAX(bp.amount) AS amount,
//             MAX(bp.payment_mode) AS mode,
//             MAX(a.bank) AS bank,
//             MAX(bp.reference_no) AS refNo,
//             MAX(s.id) AS invoice_no,
//             MAX(bp.notes) AS notes
//           FROM buyer_payments bp
//           LEFT JOIN accounts a ON bp.bank_account_id = a.id
//           LEFT JOIN buyer_payment_installments bpi ON bpi.buyer_payment_id = bp.id
//           LEFT JOIN buyer_installments bi ON bpi.buyer_installment_id = bi.id
//           LEFT JOIN sales s ON bi.sale_id = s.id
//           WHERE bp.buyer_id = ?
//           GROUP BY bp.id
//           ORDER BY bp.date DESC
//         `;

//         db.query(paymentsQuery, [buyerId], (err, paymentRows) => {
//           if (err) {
//             console.error("Error fetching payments:", err);
//             return res.status(500).json({ error: "Internal server error" });
//           }

//           const totalUnpaid = installmentRows.reduce((sum, row) => {
//   const unpaid = parseFloat(row.amount) - parseFloat(row.paidAmount || 0);
//   return sum + (unpaid > 0 ? unpaid : 0);
// }, 0);

//           return res.json({
//             name: buyer.name,
//             address: buyer.address,
//             phone,
//             mobile: "N/A", // If you store mobiles separately, add query here
//             totalUnpaid,
//             unpaidInstallments: installmentRows,
//             payments: paymentRows
//           });
//         });
//       });
//     });
//   });
// };

module.exports = {
  getBuyerReceivables,
  AddPayment,
 getBuyerReceivableCard
};
