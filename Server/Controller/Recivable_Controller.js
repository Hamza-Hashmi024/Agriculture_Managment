const db = require("../config/db");
const moment = require("moment");



const getBuyerReceivables = (req, res) => {
  const query = `
    SELECT 
      b.id AS buyerId,
      b.name AS buyerName,
      COALESCE(SUM(s.total_buyer_payable), 0) AS totalBuyerPayable,
      COALESCE(SUM(bpi.amount), 0) AS totalPayments
    FROM buyers b
    LEFT JOIN sales s ON s.buyer_id = b.id
    LEFT JOIN buyer_installments bi ON bi.sale_id = s.id
    LEFT JOIN buyer_payment_installments bpi ON bpi.buyer_installment_id = bi.id
    GROUP BY b.id
    HAVING totalBuyerPayable > 0;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching buyer receivables:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    const receivables = results.map(row => {
      const totalBuyerPayable = parseFloat(row.totalBuyerPayable);
      const totalPayments = parseFloat(row.totalPayments);
      const remainingDue = totalBuyerPayable - totalPayments;

      return {
        buyerId: row.buyerId,
        buyerName: row.buyerName,
        totalBuyerPayable,
        totalPayments,
        remainingDue: remainingDue > 0 ? remainingDue : 0
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
    installments = [], // optional now
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

    // Step 1: If installments not provided, fetch pending ones
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

        const pendingInstallmentIds = rows.map((row) => ({
          id: row.id,
          amount: parseFloat(row.amount),
        }));

        callback(pendingInstallmentIds);
      });
    };

    // Step 2: Process installments
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

          const appliedAmount = Math.min(remainingAmount, installmentAmount);

          db.execute(
            `INSERT INTO buyer_payment_installments (buyer_payment_id, buyer_installment_id, amount) VALUES (?, ?, ?)`,
            [paymentId, installmentId, appliedAmount],
            (linkErr) => {
              if (linkErr) {
                console.error("Error linking payment to installment:", linkErr);
                return processInstallments(index + 1);
              }

              // Update status
              let newStatus = "pending";
              if (appliedAmount === installmentAmount) {
                newStatus = "paid";
              } else if (appliedAmount > 0) {
                newStatus = "partial";
              }

              db.execute(
                `UPDATE buyer_installments SET status = ? WHERE id = ?`,
                [newStatus, installmentId],
                (updateErr) => {
                  if (updateErr) {
                    console.error("Error updating installment:", updateErr);
                  }

                  remainingAmount -= appliedAmount;
                  processInstallments(index + 1);
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


// const AddPayment = (req, res) => {
//   const {
//     buyerId,
//     amount,
//     paymentDate,
//     installments,
//     paymentMode,
//     bankAccountId,
//     referenceNo,
//     proofFileUrl,
//     notes,
//   } = req.body;

//   if (!buyerId || !amount || !paymentDate || !paymentMode || !installments || installments.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing required fields or installments not selected",
//     });
//   }

//   const insertPaymentSql = `
//     INSERT INTO buyer_payments (
//       buyer_id, amount, date, payment_mode,
//       bank_account_id, reference_no, proof_file_url, notes
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const insertValues = [
//     buyerId,
//     amount,
//     paymentDate,
//     paymentMode,
//     bankAccountId || null,
//     referenceNo || null,
//     proofFileUrl || null,
//     notes || null,
//   ];

//   db.execute(insertPaymentSql, insertValues, (err, result) => {
//     if (err) {
//       console.error("Error inserting payment:", err);
//       return res.status(500).json({ success: false, message: "Failed to add payment" });
//     }

//     const paymentId = result.insertId;
//     let remainingAmount = amount;

//     const processInstallments = (index) => {
//       if (index >= installments.length || remainingAmount <= 0) {
//         return res.status(201).json({
//           success: true,
//           message: "Payment distributed across installments",
//           paymentId,
//         });
//       }

//       const installmentId = installments[index];

//       db.execute(
//         "SELECT amount FROM buyer_installments WHERE id = ?",
//         [installmentId],
//         (selectErr, [installment]) => {
//           if (selectErr || !installment) {
//             console.error("Error fetching installment:", selectErr);
//             return processInstallments(index + 1); // Skip and move to next
//           }

//           const installmentAmount = parseFloat(installment.amount);
//           const appliedAmount = Math.min(remainingAmount, installmentAmount);

//           // Insert into buyer_payment_installments
//           db.execute(
//             `INSERT INTO buyer_payment_installments (buyer_payment_id, buyer_installment_id, amount) VALUES (?, ?, ?)`,
//             [paymentId, installmentId, appliedAmount],
//             (linkErr) => {
//               if (linkErr) {
//                 console.error("Error linking payment to installment:", linkErr);
//                 return processInstallments(index + 1);
//               }

//               // Update status
//               let newStatus = "pending";
//               if (appliedAmount === installmentAmount) {
//                 newStatus = "paid";
//               } else if (appliedAmount > 0) {
//                 newStatus = "partial";
//               }

//               db.execute(
//                 `UPDATE buyer_installments SET status = ? WHERE id = ?`,
//                 [newStatus, installmentId],
//                 (updateErr) => {
//                   if (updateErr) {
//                     console.error("Error updating installment:", updateErr);
//                   }

//                   // Deduct and move to next
//                   remainingAmount -= appliedAmount;
//                   processInstallments(index + 1);
//                 }
//               );
//             }
//           );
//         }
//       );
//     };

//     processInstallments(0); 
//   });
// };


module.exports = {
  getBuyerReceivables,
  AddPayment,
};
