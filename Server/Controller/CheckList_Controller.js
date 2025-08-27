const db = require("../config/db")

const GetAllCheques = (req, res) => {
    const query = `
        SELECT 
            bpc.id,
            bpc.buyer_payment_id,
            b.name AS buyer_name,
            MAX(s.arrival_date) AS sale_date,  -- latest sale date le li
            bpc.payment_type,
            bpc.cheque_no,
            bpc.cheque_date,
            bpc.bank_name,
            bp.amount,              
            bpc.status
        FROM buyer_payment_checks bpc
        JOIN buyer_payments bp 
            ON bpc.buyer_payment_id = bp.id
        JOIN buyers b 
            ON bp.buyer_id = b.id
        LEFT JOIN sales s 
            ON b.id = s.buyer_id
        GROUP BY 
            bpc.id, bpc.buyer_payment_id, b.name, 
            bpc.payment_type, bpc.cheque_no, bpc.cheque_date, 
            bpc.bank_name, bp.amount, bpc.status
    `;

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.status(200).json(result);
    });
};


const UpdateChequeStatus = (req, res) => {
  const { chequeId, status } = req.body;

  const validStatuses = ["outstanding", "pending", "cleared", "bounced"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  // 1 Update cheque status
  const updateChequeQuery = `
    UPDATE buyer_payment_checks
    SET status = ?
    WHERE id = ?
  `;

  db.query(updateChequeQuery, [status, chequeId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update cheque status", details: err });
    }

    // 2 If status is cleared, create buyer_payment entry
    if (status === "cleared") {
      const chequeDetailsQuery = `SELECT * FROM buyer_payment_checks WHERE id = ?`;
      db.query(chequeDetailsQuery, [chequeId], (err, rows) => {
        if (err || rows.length === 0) {
          return res.status(500).json({ error: "Cheque details fetch failed" });
        }

        const cheque = rows[0];

        // Check if payment already exists for this cheque
        const checkPaymentExistsQuery = `
          SELECT * FROM buyer_payments
          WHERE id = ?
        `;
        db.query(checkPaymentExistsQuery, [cheque.buyer_payment_id], (err, paymentRows) => {
          if (err) return res.status(500).json({ error: "Payment check failed", details: err });

          if (paymentRows.length > 0) {
            return res.status(200).json({ message: "Cheque cleared. Payment already exists." });
          }

          // Insert buyer payment
          const insertPaymentQuery = `
            INSERT INTO buyer_payments 
            (buyer_id, amount, date, payment_mode, payment_type, notes)
            SELECT bp.buyer_id, bp.amount, CURDATE(), 'check', 'upfront', 'Auto payment for cleared cheque'
            FROM buyer_payments bp
            WHERE bp.id = ?
          `;

          db.query(insertPaymentQuery, [cheque.buyer_payment_id], (err) => {
            if (err) {
              return res.status(500).json({ error: "Failed to create buyer payment", details: err });
            }
            return res.status(200).json({ message: "Cheque cleared and buyer payment recorded." });
          });
        });
      });
    } else {
      // For bounced / outstanding / pending
      return res.status(200).json({ message: `Cheque status updated to ${status}` });
    }
  });
};


module.exports = {GetAllCheques , UpdateChequeStatus }