const db = require("../config/db");
const moment = require("moment");
const distributeInstallments = require("../Helper/distributeInstallments");

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

// const AddPayment = (req, res) => {
//   let {
//     buyerId,
//     amount,
//     paymentDate,
//     installments = [],
//     paymentMode,
//     bankAccountId,
//     referenceNo,
//     proofFileUrl,
//     notes,
//   } = req.body;

//   if (!buyerId || !amount || !paymentDate || !paymentMode) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing required fields",
//     });
//   }

//   installments = installments.map((i) => {
//     if (typeof i === "number") {
//       return { id: i, amount: null };
//     } else if (typeof i === "object" && i !== null && i.id !== undefined) {
//       return {
//         id: parseInt(i.id),
//         amount: i.amount ?? null,
//       };
//     } else {
//       return null;
//     }
//   }).filter(Boolean);

//   const sanitize = (values) => {
//     return values.map(v => v === undefined ? null : v);
//   };

//   const insertPaymentSql = `
//     INSERT INTO buyer_payments (
//       buyer_id, amount, date, payment_mode,
//       bank_account_id, reference_no, proof_file_url, notes
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const insertValues = sanitize([
//     buyerId,
//     amount,
//     paymentDate,
//     paymentMode,
//     bankAccountId,
//     referenceNo,
//     proofFileUrl,
//     notes,
//   ]);

//   db.execute(insertPaymentSql, insertValues, (err, result) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: "Failed to add payment" });
//     }

//     const paymentId = result.insertId;
//     let remainingAmount = amount;

//     const fetchInstallmentsIfNeeded = (callback) => {
//       if (installments.length > 0) {
//         return callback(installments);
//       }

//       const fetchPendingSql = `
//         SELECT bi.id, bi.amount 
//         FROM buyer_installments AS bi
//         JOIN sales AS s ON bi.sale_id = s.id
//         WHERE s.buyer_id = ? AND bi.status != 'paid'
//         ORDER BY bi.due_date ASC
//       `;

//       db.execute(fetchPendingSql, [buyerId], (fetchErr, rows) => {
//         if (fetchErr) {
//           return res.status(500).json({
//             success: false,
//             message: "Failed to fetch installments for auto-distribution",
//           });
//         }

//         const pendingInstallments = rows.map((row) => ({
//           id: row.id,
//           amount: parseFloat(row.amount),
//         }));

//         callback(pendingInstallments);
//       });
//     };

//     fetchInstallmentsIfNeeded((list) => {
//       const processInstallments = (index) => {
//         if (index >= list.length || remainingAmount <= 0) {
//           return res.status(201).json({
//             success: true,
//             message: "Payment added and distributed across installments",
//             paymentId,
//           });
//         }

//         const { id: installmentId, amount: knownAmount } = list[index];

//         const getInstallmentAmount = (callback) => {
//           if (knownAmount !== null) return callback(knownAmount);

//           db.execute(
//             "SELECT amount FROM buyer_installments WHERE id = ?",
//             [installmentId],
//             (err, [row]) => {
//               if (err || !row) return callback(null);
//               callback(parseFloat(row.amount));
//             }
//           );
//         };

//         getInstallmentAmount((installmentAmount) => {
//           if (installmentAmount === null) {
//             return processInstallments(index + 1);
//           }

//           db.execute(
//             "SELECT SUM(amount) AS totalPaid FROM buyer_payment_installments WHERE buyer_installment_id = ?",
//             [installmentId],
//             (sumErr, [sumRow]) => {
//               if (sumErr) {
//                 return processInstallments(index + 1);
//               }

//               const totalPaid = parseFloat(sumRow.totalPaid || 0);
//               const remainingInstallmentAmount = installmentAmount - totalPaid;

//               if (remainingInstallmentAmount <= 0) {
//                 return processInstallments(index + 1);
//               }

//               const appliedAmount = Math.min(remainingAmount, remainingInstallmentAmount);

//               db.execute(
//                 `INSERT INTO buyer_payment_installments (buyer_payment_id, buyer_installment_id, amount) VALUES (?, ?, ?)`,
//                 [paymentId, installmentId, appliedAmount],
//                 (linkErr) => {
//                   if (linkErr) {
//                     return processInstallments(index + 1);
//                   }

//                   const newTotalPaid = totalPaid + appliedAmount;
//                   let newStatus = "pending";
//                   if (newTotalPaid >= installmentAmount) newStatus = "paid";
//                   else if (newTotalPaid > 0) newStatus = "partial";

//                   db.execute(
//                     `UPDATE buyer_installments SET status = ? WHERE id = ?`,
//                     [newStatus, installmentId],
//                     (updateErr) => {
//                       remainingAmount -= appliedAmount;
//                       processInstallments(index + 1);
//                     }
//                   );
//                 }
//               );
//             }
//           );
//         });
//       };

//       processInstallments(0);
//     });
//   });
// };


const AddPayment = (req, res) => {
  const {
    buyerId: buyer_id,
    amount,
    paymentMode,
    bankAccountId,
    referenceNo,
    notes,
    chequeDetails,
  } = req.body;

  if (!buyer_id || !amount || !paymentMode) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  // Frontend 'cheque' → DB expects 'check'
  const dbPaymentMode = paymentMode === "cheque" ? "check" : paymentMode;

  const insertPaymentSql = `
    INSERT INTO buyer_payments 
    (buyer_id, amount, date, payment_mode, payment_type, bank_account_id, reference_no, notes)
    VALUES (?, ?, CURDATE(), ?, 'later', ?, ?, ?)
  `;

  db.query(
    insertPaymentSql,
    [buyer_id, amount, dbPaymentMode, bankAccountId || null, referenceNo || null, notes || "Manual payment"],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Payment insert failed", details: err });
      }

      const paymentId = result.insertId;

      // Cheque flow → no installments distribution
      if (dbPaymentMode === "check" && chequeDetails) {
        const chequeSql = `
          INSERT INTO buyer_payment_checks
          (buyer_payment_id, cheque_no, cheque_date, bank_name, payment_type, status)
          VALUES (?, ?, ?, ?, ?, 'outstanding')
        `;
        db.query(
          chequeSql,
          [
            paymentId,
            chequeDetails.chequeNo,
            chequeDetails.chequeDate,
            chequeDetails.bankName,
            chequeDetails.paymentType || "later",
          ],
          (chequeErr) => {
            if (chequeErr) {
              return res.status(500).json({ error: "Cheque insert failed", details: chequeErr });
            }
            return res.status(200).json({
              message: "Cheque payment added successfully (no installments distributed yet).",
              payment_id: paymentId,
            });
          }
        );
      } else {
        // Cash / Bank → distribute installments
        distributeInstallments(paymentId, buyer_id, (distErr, result) => {
          if (distErr) {
            return res.status(500).json({ error: "Installment distribution failed", details: distErr });
          }
          return res.status(200).json({
            message: "Payment added successfully. Installments distributed.",
            payment_id: paymentId,
            distributedAmount: result.distributed,
          });
        });
      }
    }
  );
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


const getReceivablesDueOn = (req, res) => {
  const { date, includePartial } = req.query;
  // includePartial default true (you can change)
  const includePartialBool = includePartial === undefined ? true : includePartial === "true";

  // status filter
  const statuses = includePartialBool ? "('pending','partial')" : "('pending')";

  // SQL: we compute paid per installment and then pick installments due on target date
  const sql = `
    WITH paid AS (
      SELECT buyer_installment_id, SUM(amount) AS paid
      FROM buyer_payment_installments
      GROUP BY buyer_installment_id
    )
    SELECT 
      b.id AS buyerId,
      b.name AS buyerName,
      COUNT(*) AS installmentsCount,
      SUM(GREATEST(0, bi.amount - COALESCE(paid.paid, 0))) AS dueTodayAmount
    FROM buyer_installments bi
    JOIN sales s ON s.id = bi.sale_id
    JOIN buyers b ON b.id = s.buyer_id
    LEFT JOIN paid ON paid.buyer_installment_id = bi.id
    WHERE bi.due_date = COALESCE(?, CURDATE())
      AND bi.status IN ${statuses}
      AND (bi.amount - COALESCE(paid.paid,0)) > 0
    GROUP BY b.id, b.name
    ORDER BY dueTodayAmount DESC, b.name ASC;
  `;

  db.query(sql, [date || null], (err, rows) => {
    if (err) {
      console.error("Error fetching due-today:", err);
      return res.status(500).json({ error: "DB error", details: err.message || err });
    }
    // ensure numeric values are numbers
    const result = rows.map(r => ({
      buyerId: r.buyerId,
      buyerName: r.buyerName,
      installmentsCount: Number(r.installmentsCount || 0),
      dueTodayAmount: Number(r.dueTodayAmount || 0)
    }));
    res.json(result);
  });
};

/**
 * GET /api/receivables/due-today/:buyerId
 * Returns installment-level rows for that buyer on the date
 * Query params:
 *  - date (optional) default CURDATE()
 */
const getReceivablesDueOnByBuyer = (req, res) => {
  const { buyerId } = req.params;
  const { date } = req.query;

  if (!buyerId) return res.status(400).json({ error: "buyerId required" });

  const sql = `
    WITH paid AS (
      SELECT buyer_installment_id, SUM(amount) AS paid
      FROM buyer_payment_installments
      GROUP BY buyer_installment_id
    )
    SELECT
      bi.id AS installmentId,
      s.id AS invoiceNo,
      bi.amount,
      COALESCE(paid.paid, 0) AS paidAmount,
      (bi.amount - COALESCE(paid.paid, 0)) AS remaining,
      DATE_FORMAT(bi.due_date, '%Y-%m-%d') AS dueDate,
      bi.status
    FROM buyer_installments bi
    JOIN sales s ON s.id = bi.sale_id
    LEFT JOIN paid ON paid.buyer_installment_id = bi.id
    WHERE s.buyer_id = ?
      AND bi.due_date = COALESCE(?, CURDATE())
      AND bi.status IN ('pending','partial')
      AND (bi.amount - COALESCE(paid.paid,0)) > 0
    ORDER BY bi.due_date ASC, bi.id ASC;
  `;

  db.query(sql, [buyerId, date || null], (err, rows) => {
    if (err) {
      console.error("Error fetching due-today by buyer:", err);
      return res.status(500).json({ error: "DB error", details: err.message || err });
    }

    const result = rows.map(r => ({
      installmentId: r.installmentId,
      invoiceNo: r.invoiceNo,
      amount: Number(r.amount),
      paidAmount: Number(r.paidAmount),
      remaining: Number(r.remaining),
      dueDate: r.dueDate,
      status: r.status
    }));
    res.json(result);
  });
};


const extendInstallmentDueDate = (req, res) => {
  const { installmentId } = req.params;
  const { newDueDate, userId } = req.body;

  if (!installmentId || !newDueDate) {
    return res.status(400).json({ error: "installmentId and newDueDate required" });
  }

  db.beginTransaction(err => {
    if (err) {
      console.error("Transaction start error:", err);
      return res.status(500).json({ error: "DB transaction error" });
    }

    // Step 1: Get current due_date
    const selectSql = "SELECT due_date FROM buyer_installments WHERE id = ?";
    db.query(selectSql, [installmentId], (err, rows) => {
      if (err || rows.length === 0) {
        return db.rollback(() => {
          console.error("Select error:", err);
          res.status(404).json({ error: "Installment not found" });
        });
      }

      const oldDueDate = rows[0].due_date;

      // Step 2: Insert into history
      const insertHistorySql = `
        INSERT INTO buyer_installment_due_date_history 
        (buyer_installment_id, old_due_date, new_due_date, changed_by)
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertHistorySql, [installmentId, oldDueDate, newDueDate, userId || null], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error("History insert error:", err);
            res.status(500).json({ error: "Failed to save history" });
          });
        }

        // Step 3: Update installment due_date
        const updateSql = `UPDATE buyer_installments 
SET due_date = ? 
WHERE id = ? AND status IN ('pending','partial')`;
        db.query(updateSql, [newDueDate, installmentId], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Update error:", err);
              res.status(500).json({ error: "Failed to update due_date" });
            });
          }

          // Step 4: Commit
          db.commit(err => {
            if (err) {
              return db.rollback(() => {
                console.error("Commit error:", err);
                res.status(500).json({ error: "Transaction commit failed" });
              });
            }
            res.json({
              success: true,
              installmentId,
              oldDueDate,
              newDueDate
            });
          });
        });
      });
    });
  });
};


module.exports = {
  getBuyerReceivables,
  AddPayment,
  getReceivablesDueOn,
  getReceivablesDueOnByBuyer,
 getBuyerReceivableCard,
 extendInstallmentDueDate
};
