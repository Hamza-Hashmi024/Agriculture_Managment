const db = require("../config/db")
const distributeInstallments = require("../Helper/distributeInstallments");

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

  // 1️⃣ Update cheque status
  const updateQuery = `UPDATE buyer_payment_checks SET status = ? WHERE id = ?`;
  db.query(updateQuery, [status, chequeId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Cheque status update failed", details: err });
    }

    if (status === "cleared") {
      // 2️⃣ Fetch cheque details
      const chequeQuery = `
        SELECT bpc.*, bp.buyer_id, bp.amount
        FROM buyer_payment_checks bpc
        JOIN buyer_payments bp ON bpc.buyer_payment_id = bp.id
        WHERE bpc.id = ?
      `;

      db.query(chequeQuery, [chequeId], (err, chequeRows) => {
        if (err || chequeRows.length === 0) {
          return res.status(500).json({ error: "Cheque fetch failed", details: err });
        }

        const cheque = chequeRows[0];

        // 3️⃣ Installments distribution
        distributeInstallments(cheque.buyer_payment_id, cheque.buyer_id, (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Installment distribution failed", details: err });
          }

          res.status(200).json({
            message: "Cheque cleared successfully. Installments updated.",
            distributedAmount: result.distributed,
          });
        });
      });
    } else {
      // Pending / Bounced
      res.status(200).json({ message: `Cheque status updated to ${status}` });
    }
  });
};


module.exports = {GetAllCheques , UpdateChequeStatus }