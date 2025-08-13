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


const VendorLedgerReports = (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "startDate and endDate are required" });
  }

  const query = `
    SELECT 
        v.id AS vendor_id,
        v.name AS vendor_name,
        'purchase' AS type,
        ik.id AS transaction_id,
        DATE_FORMAT(a.date, '%Y-%m-%d') AS date,
        ik.description AS details,
        ik.total_amount AS amount,
        ik.paid_now AS paid,
        (ik.total_amount - ik.paid_now) AS balance
    FROM in_kind_purchases ik
    LEFT JOIN advances a ON ik.advance_id = a.id
    JOIN vendors v ON ik.vendor_id = v.id
    WHERE ik.vendor_id = ? 
      AND a.date BETWEEN ? AND ?

    UNION ALL

    SELECT 
        v.id AS vendor_id,
        v.name AS vendor_name,
        'payment' AS type,
        vp.id AS transaction_id,
        DATE_FORMAT(vp.payment_date, '%Y-%m-%d') AS date,
        vp.notes AS details,
        vp.amount AS amount,
        vp.amount AS paid,
        0 AS balance
    FROM vendors_payments vp
    JOIN vendors v ON vp.vendor_id = v.id
    WHERE vp.vendor_id = ? 
      AND vp.payment_date BETWEEN ? AND ?

    ORDER BY date, type;
  `;

  db.query(query, [id, startDate, endDate, id, startDate, endDate], (err, results) => {
    if (err) {
      console.error("Error fetching vendor ledger:", err);
      return res.status(500).json({ message: "Error fetching vendor ledger" });
    }

    res.status(200).json(results);
  });
};


const AdvanceLedger = (req, res) => {
  const { id } = req.params; // farmer id or 'all'
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required" });
  }

  // Base query
  let query = `
    SELECT 
      a.id AS advance_id,
      f.name AS farmer,
      DATE_FORMAT(a.date, '%Y-%m-%d') AS date,
      a.type AS advance_type,
      a.amount,
      a.balance,
      a.source,
      CASE 
        WHEN a.balance = 0 THEN 'Settled'
        ELSE 'Outstanding'
      END AS status
    FROM advances a
    JOIN farmers f ON a.farmer_id = f.id
    WHERE a.date BETWEEN ? AND ?`;

  const params = [startDate, endDate];

  // Add farmer filter if not 'all'
  if (id !== "all") {
    query += " AND f.id = ?";
    params.push(id);
  }

  query += " ORDER BY a.date;";

  // Execute query
  db.query(query, params, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json({ advances: results });
  });
};



module.exports = {
  FarmerLedgerReports,
   BuyerLedgerReports ,
   VendorLedgerReports,
   AdvanceLedger,
};
