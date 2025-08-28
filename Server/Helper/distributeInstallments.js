const db = require("../config/db");

function distributeInstallments(paymentId, buyerId, callback) {
  // Fetch payment details
  const paymentQuery = "SELECT * FROM buyer_payments WHERE id = ? AND buyer_id = ?";
  db.query(paymentQuery, [paymentId, buyerId], (err, paymentRows) => {
    if (err) return callback(err);
    if (paymentRows.length === 0) return callback(new Error("Payment not found"));

    let remainingAmount = paymentRows[0].amount;

    // Fetch pending installments
    const installmentsQuery = `
      SELECT bi.* 
      FROM buyer_installments bi
      JOIN sales s ON bi.sale_id = s.id
      WHERE s.buyer_id = ? AND bi.status != 'paid'
      ORDER BY bi.due_date ASC
    `;
    db.query(installmentsQuery, [buyerId], (err, instRows) => {
      if (err) return callback(err);
      const tasks = [];

      instRows.forEach(inst => {
        if (remainingAmount <= 0) return;
        const toPay = Math.min(remainingAmount, inst.amount - (inst.paid_amount || 0));
        if (toPay <= 0) return;

        tasks.push(new Promise((resolve, reject) => {
          const insertLink = `
            INSERT INTO buyer_payment_installments (buyer_payment_id, buyer_installment_id, amount)
            VALUES (?, ?, ?)
          `;
          db.query(insertLink, [paymentId, inst.id, toPay], (err) => {
            if (err) return reject(err);

            // Update installment status & paid_amount
            const newPaid = (inst.paid_amount || 0) + toPay;
            const newStatus = newPaid >= inst.amount ? "paid" : "partial";

            const updateInstallment = `
              UPDATE buyer_installments
              SET paid_amount = ?, status = ?
              WHERE id = ?
            `;
            db.query(updateInstallment, [newPaid, newStatus, inst.id], (err) => {
              if (err) return reject(err);
              remainingAmount -= toPay;
              resolve();
            });
          });
        }));
      });

      Promise.all(tasks)
        .then(() => callback(null, { distributed: paymentRows[0].amount - remainingAmount }))
        .catch(callback);
    });
  });
}

module.exports = distributeInstallments;