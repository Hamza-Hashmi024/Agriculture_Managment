const db = require("../config/db");

const FarmerLedgerReports = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
        p.id AS payment_id,
        p.date,
        CASE 
            WHEN p.payment_type = 'upfront' THEN 'Advance'
            WHEN p.payment_type = 'later' THEN 'Payment'
            WHEN p.payment_type = 'sale' THEN 'Sale/Lot'
            ELSE 'Other'
        END AS type,
        CONCAT('#P', p.id) AS ref,
        CASE WHEN p.payment_type = 'upfront' THEN p.amount ELSE 0 END AS debit,
        CASE WHEN p.payment_type IN ('later','sale') THEN p.amount ELSE 0 END AS credit,
        @balance := @balance + 
            (CASE WHEN p.payment_type IN ('later','sale') 
                  THEN p.amount 
                  ELSE -p.amount END) AS balance,
        p.notes
    FROM buyers b
    JOIN buyer_payments p ON p.buyer_id = b.id
    CROSS JOIN (SELECT @balance := 0) vars
    WHERE b.id = ?
    ORDER BY p.date;
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching farmer ledger:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
    res.json(result);
  });
};

const BuyerLedgerReports = (req, res) => {
  const { id } = req.params;
  const query = `SELECT 
    p.id AS payment_id,
    p.date,
    CASE 
        WHEN p.payment_type = 'upfront' THEN 'Advance'
        WHEN p.payment_type = 'later' THEN 'Payment'
        WHEN p.payment_type = 'sale' THEN 'Sale/Lot'
        ELSE 'Other'
    END AS type,
    CONCAT('#P', p.id) AS ref,
    CASE WHEN p.payment_type = 'upfront' THEN p.amount ELSE 0 END AS debit,
    CASE WHEN p.payment_type IN ('later','sale') THEN p.amount ELSE 0 END AS credit,
    @balance := @balance + 
        (CASE WHEN p.payment_type IN ('later','sale') 
              THEN p.amount 
              ELSE -p.amount END) AS balance,
    p.notes
FROM buyers b
JOIN buyer_payments p ON p.buyer_id = b.id
CROSS JOIN (SELECT @balance := 0) vars
WHERE b.id = ?
ORDER BY p.date;`;
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching farmer ledger:", err);
      return res.status(500).json({ message: "Error fetching data" });
    }
    res.json(result);
  });
};

module.exports = {
  FarmerLedgerReports,
   BuyerLedgerReports 
};
