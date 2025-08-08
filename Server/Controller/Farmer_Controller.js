const db = require("../config/db");

const RegisterFarmer = (req, res) => {
  const {
    tenant_id,
    name,
    cnic,
    village,
    profile_photo_url,
    contacts,
    bankAccounts,
    wallets,
  } = req.body;

  // Step 1: Insert into farmers table
  const insertFarmerQuery = `
    INSERT INTO farmers (tenant_id, name, cnic, village, profile_photo_url)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertFarmerQuery,
    [tenant_id, name, cnic, village, profile_photo_url],
    (err, result) => {
      if (err) {
        console.error("Insert farmer error:", err);
        return res.status(500).send({ message: "Error saving farmer" });
      }

      const farmerId = result.insertId;

      // Step 2: Insert contacts (if any)
      const contactValues = contacts?.map((phone) => [farmerId, phone]);
      if (contactValues?.length) {
        const contactQuery = `INSERT INTO farmer_contacts (farmer_id, phone_number) VALUES ?`;
        db.query(contactQuery, [contactValues], (err) => {
          if (err) console.error("Contact insert failed:", err);
        });
      }

      // Step 3: Insert bank accounts (if any)
      const bankValues = bankAccounts?.map((acc) => [
        farmerId,
        acc.bankName,
        acc.accountNo,
        acc.iban,
      ]);
      if (bankValues?.length) {
        const bankQuery = `
        INSERT INTO farmer_bank_accounts (farmer_id, bank_name, account_number, iban) VALUES ?
      `;
        db.query(bankQuery, [bankValues], (err) => {
          if (err) console.error("Bank account insert failed:", err);
        });
      }

      // Step 4: Insert wallets (if any)
      const walletValues = wallets?.map((wallet) => [
        farmerId,
        wallet.provider,
        wallet.number,
      ]);
      if (walletValues?.length) {
        const walletQuery = `
        INSERT INTO farmer_wallets (farmer_id, provider, wallet_number) VALUES ?
      `;
        db.query(walletQuery, [walletValues], (err) => {
          if (err) console.error("Wallet insert failed:", err);
        });
      }

      return res
        .status(201)
        .send({ message: "Farmer registered successfully", farmerId });
    }
  );
};

const GetAllFarmers = (req, res) => {
  const query = `
    SELECT 
      f.id, 
      f.name, 
      f.cnic, 
      f.village,
      f.profile_photo_url,
      COALESCE(SUM(a.amount), 0) AS totalAdvances
    FROM farmers f
    LEFT JOIN advances a ON f.id = a.farmer_id
    GROUP BY f.id
  `;

  db.query(query, (err, farmers) => {
    if (err) {
      console.error("Error fetching farmers:", err);
      return res.status(500).send({ message: "Error fetching farmers" });
    }

    const contactQuery = `
      SELECT farmer_id, phone_number FROM farmer_contacts
    `;

    db.query(contactQuery, (err, contacts) => {
      if (err) {
        console.error("Error fetching contacts:", err);
        return res.status(500).send({ message: "Error fetching contacts" });
      }

      const response = farmers.map((farmer) => {
        const farmerContacts = contacts
          .filter((c) => c.farmer_id === farmer.id)
          .map((c) => c.phone_number);

        return {
          ...farmer,
          contacts: farmerContacts,
          totalAdvances: `PKR ${Number(farmer.totalAdvances).toLocaleString()}`,
          status: Number(farmer.totalAdvances) > 0 ? "Active" : "Inactive",
        };
      });

      res.status(200).send(response);
    });
  });
};


const getFarmerByIdFull = (req, res) => {
  const { id } = req.params;

  const getFarmerData = (farmer) => {
    return new Promise((resolve, reject) => {
      const farmerId = farmer.id;

      const data = {
        id: farmer.id,
        name: farmer.name,
        cnic: farmer.cnic,
        village: farmer.village,
        profilePhoto: farmer.profile_photo_url,
        contacts: [],
        bankAccounts: [],
        wallets: [],
        advances: [],
        settlements: [],
        cropSales: [] 
      };

      db.query("SELECT phone_number FROM farmer_contacts WHERE farmer_id = ?", [farmerId], (err, contacts) => {
        if (err) return reject(err);
        data.contacts = contacts.map((c) => c.phone_number);

        db.query("SELECT bank_name AS bank, account_number AS account, iban FROM farmer_bank_accounts WHERE farmer_id = ?", [farmerId], (err, banks) => {
          if (err) return reject(err);
          data.bankAccounts = banks;

          db.query("SELECT provider, wallet_number AS number FROM farmer_wallets WHERE farmer_id = ?", [farmerId], (err, wallets) => {
            if (err) return reject(err);
            data.wallets = wallets;

            db.query(`
              SELECT 
                a.id,
                a.date,
                IF(a.type = 'cash', 'Cash', 'In-Kind') AS type,
                a.amount,
                0 AS balance,
                a.source_type AS source,
                a.reference_no AS reference,
                (
                  SELECT GROUP_CONCAT(v.name SEPARATOR ', ')
                  FROM in_kind_purchases ikp
                  JOIN vendors v ON ikp.vendor_id = v.id
                  WHERE ikp.advance_id = a.id
                ) AS vendor
              FROM advances a
              WHERE a.farmer_id = ?
              ORDER BY a.date ASC
            `, [farmerId], (err, advances) => {
              if (err) return reject(err);
              data.advances = advances;

              db.query(`
                SELECT 
                  fs.id, 
                  s.arrival_date AS date,
                  CONCAT(c.name, ' Sale') AS description,
                  fs.total_gross AS debit,
                  0 AS credit,
                  fs.net_payable AS balance
                FROM farmer_settlements fs
                JOIN sales s ON fs.sale_id = s.id
                JOIN crops c ON s.crop = c.id
                WHERE s.farmer_id = ?
              `, [farmerId], (err, settlements) => {
                if (err) return reject(err);

                db.query(`
                  SELECT 
                    id, date, amount, payment_mode,
                    reference_no AS reference,
                    amount AS credit,
                    0 AS debit,
                    NULL AS balance,
                    'Payment to Farmer' AS description
                  FROM farmer_payments
                  WHERE farmer_id = ?
                `, [farmerId], (err, payments) => {
                  if (err) return reject(err);

                  // Combine transaction history
                  const history = [...settlements, ...payments, ...advances];
                  history.sort((a, b) => new Date(a.date) - new Date(b.date));
                  data.settlements = history;

                  // Now fetch Crop Sales (the part that was missing)
                  db.query(`SELECT 
  s.id,
  s.arrival_date,
  s.crop,
  b.name AS buyer,
  s.commission_percent,
  s.status,

  -- Final payable = total_buyer_payable - commission - expenses
  (
    s.total_buyer_payable 
    - (s.total_buyer_payable * s.commission_percent / 100) 
    - IFNULL(SUM(e.amount), 0)
  ) AS total_farmer_payable

FROM sales s
LEFT JOIN buyers b ON s.buyer_id = b.id
LEFT JOIN sale_farmer_expenses e ON s.id = e.sale_id

WHERE s.farmer_id = ?

GROUP BY 
  s.id, s.arrival_date, s.crop, b.name, 
  s.commission_percent, s.status, s.total_buyer_payable;
    
   `, [farmerId], (err, cropSales) => {
                    if (err) return reject(err);
                    data.cropSales = cropSales; 
                    resolve(data); 
                  });
                });
              });
            });
          });
        });
      });
    });
  };

  db.query("SELECT * FROM farmers WHERE id = ?", [id], async (err, results) => {
    if (err) {
      console.error("Error fetching farmer:", err);
      return res.status(500).json({ message: "Error fetching farmer." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Farmer not found." });
    }

    try {
      const fullFarmerData = await getFarmerData(results[0]);
      res.json(fullFarmerData);
    } catch (error) {
      console.error("Error processing farmer data:", error);
      res.status(500).json({ message: "Failed to process farmer data." });
    }
  });
};


const GetAllFarmerPayable = (req, res) => {
  const query = `
 SELECT 
  f.id,
  f.name AS farmer_name,

  -- 🟢 Net Payable Calculation
  COALESCE(SUM(s.total_buyer_payable), 0)
  - COALESCE(SUM(s.total_buyer_payable * s.commission_percent / 100), 0)
  - COALESCE(SUM(exp.total_expense), 0)
  - COALESCE(adv.total_advance, 0)
  - COALESCE(pay.total_payment, 0)
  AS net_payable,

  -- Last Sale Date
  MAX(s.arrival_date) AS last_sale_date,

  -- Last Payment Date
  (
    SELECT MAX(fp.date)
    FROM farmer_payments fp
    WHERE fp.farmer_id = f.id
  ) AS last_payment_date

FROM farmers f

LEFT JOIN sales s ON f.id = s.farmer_id

-- Sale Expenses
LEFT JOIN (
  SELECT sale_id, SUM(amount) AS total_expense
  FROM sale_farmer_expenses
  GROUP BY sale_id
) exp ON s.id = exp.sale_id

-- Advances
LEFT JOIN (
  SELECT farmer_id, SUM(amount) AS total_advance
  FROM advances
  GROUP BY farmer_id
) adv ON f.id = adv.farmer_id

-- Payments
LEFT JOIN (
  SELECT farmer_id, SUM(amount) AS total_payment
  FROM farmer_payments
  GROUP BY farmer_id
) pay ON f.id = pay.farmer_id

GROUP BY f.id, f.name
HAVING net_payable > 0  -- Optional: show only farmers who are owed money
ORDER BY net_payable DESC;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "Error While Fetching Farmer Payable" });
    }

    res.json(result);
  });
};

const AddFarmerPayments = (req, res) => {
  const query = `INSERT INTO farmer_payments 
    (farmer_id, sale_id, amount, payment_mode, bank_account_id, reference_no, date, proof_file_url, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const {
    farmer_id,
    sale_id = null,
    amount,
    payment_mode,
    bank_account_id = null,
    reference_no,
    date,
    proof_file_url,
    notes,
  } = req.body;

  const values = [
    farmer_id,
    sale_id,
    amount,
    payment_mode,
    bank_account_id,
    reference_no,
    date,
    proof_file_url,
    notes,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(400).json({ message: "Error while adding farmer payment" });
    }

    return res.status(201).json({
      message: "Farmer payment added successfully",
      insertId: result.insertId,
    });
  });
};

const FarmerPayableSummary = (req, res) => {
  const farmerId = Number(req.params.farmer_id);
  if (!Number.isInteger(farmerId) || farmerId <= 0) {
    return res.status(400).json({ message: 'Invalid farmer_id param' });
  }

  const query = `
SELECT 
    f.name AS farmer_name,
    COALESCE(sales_data.total_sales, 0) AS total_sales,
    COALESCE(sales_data.net_payable, 0) AS net_payable,
    COALESCE(sales_data.sales_history, JSON_ARRAY()) AS sales_history,
    COALESCE(payments_data.payment_history, JSON_ARRAY()) AS payment_history
FROM farmers f
LEFT JOIN (
    SELECT 
        s.farmer_id,
        SUM(s.total_buyer_payable) AS total_sales,
        SUM(s.total_buyer_payable - ((s.commission_percent / 100) * s.total_buyer_payable)) AS net_payable,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'sale_date', s.arrival_date,
                'crop', s.crop,
                'sale_amount', s.total_buyer_payable,
                'commission_percent', s.commission_percent,
                'sale_status', s.status
            )
        ) AS sales_history
    FROM sales s
    WHERE s.farmer_id = ?
    GROUP BY s.farmer_id
) AS sales_data 
    ON f.id = sales_data.farmer_id
LEFT JOIN (
    SELECT 
        p.farmer_id,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'payment_date', p.date,
                'payment_amount', p.amount,
                'payment_mode', p.payment_mode,
                'bank_reference', p.reference_no,
                'notes', p.notes
            )
        ) AS payment_history
    FROM farmer_payments p
    WHERE p.farmer_id = ?
    GROUP BY p.farmer_id
) AS payments_data 
    ON f.id = payments_data.farmer_id
WHERE f.id = ?
LIMIT 1;
`;

  db.query(query, [farmerId, farmerId, farmerId], (err, rows) => {
    if (err) {
      console.error('SQL Error:', err.sqlMessage || err);
      return res.status(500).json({ message: 'Error Fetching FarmerPayableSummary', error: err.sqlMessage || String(err) });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const row = rows[0];

    // Helper to safely parse JSON (mysql2 may return JSON columns as strings)
    const safeParse = (val) => {
      if (!val) return [];
      if (typeof val === 'object') return val; // already parsed
      try { return JSON.parse(val); } catch (e) { return []; }
    };

    let salesHistory = safeParse(row.sales_history);
    let paymentHistory = safeParse(row.payment_history);

    // Sort in descending date order (newest first)
    const parseDate = (d) => d ? new Date(d) : new Date(0);
    salesHistory.sort((a, b) => parseDate(b.sale_date) - parseDate(a.sale_date));
    paymentHistory.sort((a, b) => parseDate(b.payment_date) - parseDate(a.payment_date));

    

    const result = {
      farmer_name: row.farmer_name,
      total_sales: row.total_sales,
      net_payable: row.net_payable,
      sales_history: salesHistory,
      payment_history: paymentHistory
    };

    return res.json(result);
  });
};



module.exports = {
  RegisterFarmer,
  GetAllFarmers,
  getFarmerByIdFull,
  GetAllFarmerPayable,
  AddFarmerPayments,
  FarmerPayableSummary
};
