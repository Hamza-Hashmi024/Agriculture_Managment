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
    return res
      .status(400)
      .json({ message: "startDate and endDate are required" });
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

  db.query(
    query,
    [id, startDate, endDate, id, startDate, endDate],
    (err, results) => {
      if (err) {
        console.error("Error fetching vendor ledger:", err);
        return res
          .status(500)
          .json({ message: "Error fetching vendor ledger" });
      }

      res.status(200).json(results);
    }
  );
};

const AdvanceLedger = (req, res) => {
  const { id } = req.params; // farmer id or 'all'
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "startDate and endDate are required" });
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

const SalesReport = (req, res) => {
  const { startDate, endDate } = req.query;

  const query = `
    SELECT
      s.id AS sale_id,
      f.name AS farmer,
      b.name AS buyer,
      DATE_FORMAT(s.date, '%Y-%m-%d') AS date,
      s.total_amount,
      s.commission,
      (s.total_amount - s.commission) AS net_amount
    FROM sales s
    JOIN farmers f ON s.farmer_id = f.id
    JOIN buyers b ON s.buyer_id = b.id
    WHERE s.date BETWEEN ? AND ?
    ORDER BY s.date;
  `;

  db.query(query, [startDate, endDate], (err, results) => {
    if (err) {
      console.error("Error fetching sales report:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json(results);
  });
};

const ReceivableAging = (req, res) => {
  const query = `
  SELECT 
    b.id AS buyer_id,
    b.name AS buyer_name,

    SUM(CASE WHEN DATEDIFF(CURDATE(), s.arrival_date) <= 0 
             THEN s.total_buyer_payable ELSE 0 END) 
      - IFNULL(SUM(CASE WHEN DATEDIFF(CURDATE(), s.arrival_date) <= 0 THEN bp.amount ELSE 0 END), 0) AS current,

    SUM(CASE WHEN DATEDIFF(CURDATE(), s.arrival_date) BETWEEN 1 AND 7 
             THEN s.total_buyer_payable ELSE 0 END) 
      - IFNULL(SUM(CASE WHEN DATEDIFF(CURDATE(), s.arrival_date) BETWEEN 1 AND 7 THEN bp.amount ELSE 0 END), 0) AS due1to7,

    SUM(CASE WHEN DATEDIFF(CURDATE(), s.arrival_date) BETWEEN 8 AND 30 
             THEN s.total_buyer_payable ELSE 0 END) 
      - IFNULL(SUM(CASE WHEN DATEDIFF(CURDATE(), s.arrival_date) BETWEEN 8 AND 30 THEN bp.amount ELSE 0 END), 0) AS due8to30,

    SUM(CASE WHEN DATEDIFF(CURDATE(), s.arrival_date) > 30 
             THEN s.total_buyer_payable ELSE 0 END) 
      - IFNULL(SUM(CASE WHEN DATEDIFF(CURDATE(), s.arrival_date) > 30 THEN bp.amount ELSE 0 END), 0) AS due30plus,

    SUM(s.total_buyer_payable) - IFNULL(SUM(bp.amount), 0) AS total_outstanding

FROM buyers b
LEFT JOIN sales s 
  ON b.id = s.buyer_id AND s.status IN ('open','partial')
LEFT JOIN buyer_payments bp 
  ON b.id = bp.buyer_id
GROUP BY b.id, b.name
ORDER BY b.name;

`;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Error in database query", error: err });
    res.json(result);
  });
};


const PayableAging = (req, res) => {
  const query = `
    SELECT 
      v.id AS vendor_id,
      v.name AS vendor_name,

      SUM(CASE WHEN DATEDIFF(CURDATE(), DATE(e.created_at)) <= 0 
               THEN (e.amount - IFNULL(e.paid_now, 0)) ELSE 0 END) AS current,

      SUM(CASE WHEN DATEDIFF(CURDATE(), DATE(e.created_at)) BETWEEN 1 AND 7 
               THEN (e.amount - IFNULL(e.paid_now, 0)) ELSE 0 END) AS due1to7,

      SUM(CASE WHEN DATEDIFF(CURDATE(), DATE(e.created_at)) BETWEEN 8 AND 30 
               THEN (e.amount - IFNULL(e.paid_now, 0)) ELSE 0 END) AS due8to30,

      SUM(CASE WHEN DATEDIFF(CURDATE(), DATE(e.created_at)) > 30 
               THEN (e.amount - IFNULL(e.paid_now, 0)) ELSE 0 END) AS due30plus,

      SUM(e.amount - IFNULL(e.paid_now, 0)) AS total_outstanding
    FROM vendors v
    LEFT JOIN expenses e 
      ON v.id = e.vendor_id
    GROUP BY v.id, v.name
    ORDER BY v.name;
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Error in database query", error: err });
    res.json(result);
  });
};

const CashBook = (req, res) => {
  const { from, to } = req.query; // pass date range from UI

  const query = `
    SELECT 
      t.txn_date,
      t.description,
      t.type,
      t.amount,
      SUM(CASE WHEN t.type = 'Credit' THEN t.amount ELSE -t.amount END) 
          OVER (ORDER BY t.txn_date, t.id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) 
          AS running_balance
    FROM (
        -- Buyer cash payments (CREDIT)
        SELECT 
            bp.id,
            bp.date AS txn_date,
            CONCAT('Receipt from Buyer: ', b.name) AS description,
            'Credit' AS type,
            bp.amount AS amount
        FROM buyer_payments bp
        JOIN buyers b ON bp.buyer_id = b.id
        WHERE bp.payment_mode = 'cash'

        UNION ALL

        -- Vendor cash payments (DEBIT)
        SELECT 
            e.id,
            e.created_at AS txn_date,
            CONCAT('Payment to Vendor: ', v.name) AS description,
            'Debit' AS type,
            e.paid_now AS amount
        FROM expenses e
        JOIN vendors v ON e.vendor_id = v.id
        WHERE e.payment_mode = 'cashbox'
    ) t
    WHERE t.txn_date BETWEEN ? AND ?
    ORDER BY t.txn_date, t.id;
  `;

  db.query(query, [from, to], (err, result) => {
    if (err) return res.status(500).json({ message: "Error in database query", error: err });
    res.json(result);
  });
};
const BankBook = (req, res) => {
  const { from, to } = req.query;

  const query = `
    SELECT 
      t.txn_date,
      t.bank_account_id,
      CONCAT(ba.bank_name, ' - ', ba.account_number) AS account_name, -- ✅ meaningful account label
      t.description,
      t.type,
      t.amount,
      SUM(CASE WHEN t.type = 'Credit' THEN t.amount ELSE -t.amount END) 
          OVER (
            PARTITION BY t.bank_account_id 
            ORDER BY t.txn_date, t.id 
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
          ) AS running_balance
    FROM (
        -- Buyer Bank Receipts (Credit)
        SELECT 
            bp.id,
            bp.date AS txn_date,
            bp.bank_account_id,
            CONCAT('Bank Receipt from Buyer: ', b.name) AS description,
            'Credit' AS type,
            bp.amount AS amount
        FROM buyer_payments bp
        JOIN buyers b ON bp.buyer_id = b.id
        WHERE bp.payment_mode = 'bank' AND bp.bank_account_id IS NOT NULL

        UNION ALL

        -- Vendor Bank Payments (Debit)
        SELECT 
            e.id,
            e.created_at AS txn_date,
            e.bank_account_id,
            CONCAT('Bank Payment to Vendor: ', v.name) AS description,
            'Debit' AS type,
            e.paid_now AS amount
        FROM expenses e
        JOIN vendors v ON e.vendor_id = v.id
        WHERE e.payment_mode = 'bank' AND e.bank_account_id IS NOT NULL
    ) t
    JOIN vendor_bank_accounts ba ON t.bank_account_id = ba.id
    WHERE t.txn_date BETWEEN ? AND ?
    ORDER BY t.bank_account_id, t.txn_date, t.id;
  `;

  db.query(query, [from, to], (err, result) => {
    if (err) return res.status(500).json({ message: "Error in database query", error: err });
    res.json(result);
  });
};

module.exports = {
  FarmerLedgerReports,
  BuyerLedgerReports,
  VendorLedgerReports,
  AdvanceLedger,
  SalesReport,
  ReceivableAging ,
  PayableAging,
  CashBook,
  BankBook
};
