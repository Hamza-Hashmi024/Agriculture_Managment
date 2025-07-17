const db = require("../config/db");

const addBankAccount = (req, res) => {
  const {
    bank,           
    title,
    accountNo,    
    branch,
    iban,
    openingBalance,
    openingDate,
    notes           
  } = req.body;

  // Input validation (basic)
  if (!bank || !title || !accountNo || !openingBalance || !openingDate) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  const sql = `
    INSERT INTO accounts (
      type,
      title,
      account_number,
      branch,
      iban,
      opening_balance,
      opening_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    'bank',          
    title,
    accountNo,
    branch,
    iban,
    parseFloat(openingBalance),
    openingDate
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting bank account:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    return res.status(201).json({
      message: "Bank account added successfully",
      accountId: result.insertId
    });
  });
};

module.exports = addBankAccount;
