const db = require("../config/db");
const moment = require("moment");


const getBuyerReceivables = (req, res) => {
  const query = `
    SELECT 
        b.id AS buyerId,
        b.name AS buyerName,
        COALESCE(s.total_payable, 0) AS totalBuyerPayable,
        COALESCE(p.total_paid, 0) AS totalPayments,
        COALESCE(s.total_payable, 0) - COALESCE(p.total_paid, 0) AS balance,
        COALESCE(od.overdue_due, 0) AS overdueDue,
        COALESCE(od.oldest_due_date, NULL) AS oldestDueDate,
        COALESCE(ds.due_soon_due, 0) AS dueSoonDue,
        COALESCE(ds.next_due_date, NULL) AS nextDueDate
    FROM buyers b
    LEFT JOIN (
        SELECT buyer_id, SUM(total_buyer_payable) AS total_payable
        FROM sales
        GROUP BY buyer_id
    ) s ON s.buyer_id = b.id
    LEFT JOIN (
        SELECT buyer_id, SUM(amount) AS total_paid
        FROM buyer_payments
        GROUP BY buyer_id
    ) p ON p.buyer_id = b.id
    LEFT JOIN (
        SELECT s.buyer_id,
               SUM(i.amount) AS overdue_due,
               MIN(i.due_date) AS oldest_due_date
        FROM buyer_installments i
        JOIN sales s ON s.id = i.sale_id
        WHERE i.status = 'pending' AND i.due_date < CURDATE()
        GROUP BY s.buyer_id
    ) od ON od.buyer_id = b.id
    LEFT JOIN (
        SELECT s.buyer_id,
               SUM(i.amount) AS due_soon_due,
               MIN(i.due_date) AS next_due_date
        FROM buyer_installments i
        JOIN sales s ON s.id = i.sale_id
        WHERE i.status = 'pending' AND i.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
        GROUP BY s.buyer_id
    ) ds ON ds.buyer_id = b.id
    ORDER BY b.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching buyer receivables:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    const receivables = results.map((row) => {
      return {
        buyerId: row.buyerId,
        buyerName: row.buyerName,
        totalBuyerPayable: parseFloat(row.totalBuyerPayable),
        totalPayments: parseFloat(row.totalPayments),
        remainingDue: parseFloat(row.balance),
        overdueDue: parseFloat(row.overdueDue),
        dueSoonDue: parseFloat(row.dueSoonDue),
        oldestDueDate: row.oldestDueDate, // e.g. 2025-07-15
        nextDueDate: row.nextDueDate      // e.g. 2025-08-02
      };
    });

    res.status(200).json(receivables);
  });
};

const AddPayment = (req, res) => {
  const {
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

  const insertPaymentSql = `
    INSERT INTO buyer_payments (
      buyer_id, amount, date, payment_mode,
      bank_account_id, reference_no, proof_file_url, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const insertValues = [
    buyerId,
    amount,
    paymentDate,
    paymentMode,
    bankAccountId || null,
    referenceNo || null,
    proofFileUrl || null,
    notes || null,
  ];

  db.execute(insertPaymentSql, insertValues, (err, result) => {
    if (err) {
      console.error("Error inserting payment:", err);
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
          console.error("Error fetching pending installments:", fetchErr);
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

    fetchInstallmentsIfNeeded((installmentList) => {
      const list = Array.isArray(installmentList[0])
        ? installmentList.map((id) => ({ id, amount: null }))
        : installmentList;

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
              if (err || !row) {
                console.error("Error fetching installment:", err);
                return callback(null);
              }
              callback(parseFloat(row.amount));
            }
          );
        };

        getInstallmentAmount((installmentAmount) => {
          if (installmentAmount === null) {
            return processInstallments(index + 1);
          }

          // Fetch total already paid on this installment
          db.execute(
            "SELECT SUM(amount) AS totalPaid FROM buyer_payment_installments WHERE buyer_installment_id = ?",
            [installmentId],
            (sumErr, [sumRow]) => {
              if (sumErr) {
                console.error("Error fetching total paid:", sumErr);
                return processInstallments(index + 1);
              }

              const totalPaid = parseFloat(sumRow.totalPaid || 0);
              const remainingInstallmentAmount = installmentAmount - totalPaid;

              if (remainingInstallmentAmount <= 0) {
                // Already fully paid, skip
                return processInstallments(index + 1);
              }

              const appliedAmount = Math.min(remainingAmount, remainingInstallmentAmount);

              db.execute(
                `INSERT INTO buyer_payment_installments (buyer_payment_id, buyer_installment_id, amount) VALUES (?, ?, ?)`,
                [paymentId, installmentId, appliedAmount],
                (linkErr) => {
                  if (linkErr) {
                    console.error("Error linking payment to installment:", linkErr);
                    return processInstallments(index + 1);
                  }

                  const newTotalPaid = totalPaid + appliedAmount;
                  let newStatus = "pending";
                  if (newTotalPaid >= installmentAmount) {
                    newStatus = "paid";
                  } else if (newTotalPaid > 0) {
                    newStatus = "partial";
                  }

                  db.execute(
                    `UPDATE buyer_installments SET status = ? WHERE id = ?`,
                    [newStatus, installmentId],
                    (updateErr) => {
                      if (updateErr) {
                        console.error("Error updating installment status:", updateErr);
                      }

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
  
  console.log("Fetching card for buyerId:", buyerId);

  if (!buyerId) {
    return res.status(400).json({ error: "Buyer ID is required" });
  }

  // 1. Get buyer info
  const buyerInfoQuery = `
    SELECT 
      b.id,
      b.name,
      b.notes,
      IFNULL(bc.phone_number, '') AS phone,
      '' AS mobile,
      '' AS address
    FROM buyers b
    LEFT JOIN buyer_contacts bc ON bc.buyer_id = b.id
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

    // 2. Get unpaid installments
    const installmentsQuery = `
SELECT 
  bi.id,
  s.id AS invoice_no,  -- treating sale ID as invoice number
  s.crop,
  bi.amount,
  DATE_FORMAT(bi.due_date, '%d-%b-%Y') AS dueDate,
  CASE 
    WHEN bi.due_date < CURDATE() THEN 'Overdue'
    WHEN bi.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 'Due Soon'
    ELSE 'Pending'
  END AS status
FROM buyer_installments bi
INNER JOIN sales s ON bi.sale_id = s.id
WHERE s.buyer_id = ? AND bi.status != 'paid'


    `;

    db.query(installmentsQuery, [buyerId], (err, installmentRows) => {
      if (err) {
        console.error("Error fetching installments:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // 3. Get payment history
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
ORDER BY bp.date DESC;
      `;

      db.query(paymentsQuery, [buyerId], (err, paymentRows) => {
        if (err) {
          console.error("Error fetching payments:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        const totalUnpaid = installmentRows.reduce(
          (sum, row) => sum + parseFloat(row.amount || 0),
          0
        );

        return res.json({
          name: buyer.name,
          address: buyer.address || "N/A",
          phone: buyer.phone,
          mobile: buyer.mobile || "N/A",
          totalUnpaid,
          unpaidInstallments: installmentRows,
          payments: paymentRows
        });
      });
    });
  });
};

module.exports = {
  getBuyerReceivables,
  AddPayment,
 getBuyerReceivableCard
};
