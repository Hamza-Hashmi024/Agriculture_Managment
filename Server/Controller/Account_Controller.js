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
    notes,
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
    "bank",
    title,
    accountNo,
    branch,
    iban,
    parseFloat(openingBalance),
    openingDate,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting bank account:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    return res.status(201).json({
      message: "Bank account added successfully",
      accountId: result.insertId,
    });
  });
};

const createTransfer = (req, res) => {
  const { fromAccount, toAccount, amount, date, referenceNo, notes } = req.body;

  if (!fromAccount || !toAccount || !amount || !date) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if (fromAccount === toAccount) {
    return res
      .status(400)
      .json({ message: "Cannot transfer to the same account." });
  }

  const parsedAmount = parseFloat(amount);

  if (parsedAmount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be greater than zero." });
  }

  // 1. Check if from account has sufficient balance
  const checkBalanceQuery = `SELECT opening_balance FROM accounts WHERE id = ?`;

  db.query(checkBalanceQuery, [fromAccount], (err, results) => {
    if (err) {
      console.error("Balance check failed:", err);
      return res
        .status(500)
        .json({ message: "Database error while checking balance." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "From account not found." });
    }

    const currentBalance = parseFloat(results[0].opening_balance);

    if (parsedAmount > currentBalance) {
      return res
        .status(400)
        .json({ message: "Insufficient balance in the source account." });
    }

    // 2. Begin transfer
    const insertTransferQuery = `
      INSERT INTO account_transfers
      (from_account_id, to_account_id, amount, date, reference_no, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertTransferQuery,
      [
        fromAccount,
        toAccount,
        parsedAmount,
        date,
        referenceNo || null,
        notes || null,
      ],
      (err, result) => {
        if (err) {
          console.error("Insert transfer error:", err);
          return res
            .status(500)
            .json({ message: "Failed to create transfer." });
        }

        // 3. Update account balances
        const updateFrom = `UPDATE accounts SET opening_balance = opening_balance - ? WHERE id = ?`;
        const updateTo = `UPDATE accounts SET opening_balance = opening_balance + ? WHERE id = ?`;

        db.query(updateFrom, [parsedAmount, fromAccount], (err1) => {
          if (err1) {
            console.error("Error updating from account:", err1);
            return res
              .status(500)
              .json({ message: "Failed to update source account balance." });
          }

          db.query(updateTo, [parsedAmount, toAccount], (err2) => {
            if (err2) {
              console.error("Error updating to account:", err2);
              return res
                .status(500)
                .json({
                  message: "Failed to update destination account balance.",
                });
            }

            return res.status(201).json({
              message: "Transfer successful",
              transferId: result.insertId,
            });
          });
        });
      }
    );
  });
};


const getBankAccountsWithBalance = (req, res) => {
  const query = `
    SELECT id, title, type, opening_balance AS balance 
    FROM accounts 
    WHERE type = 'bank'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Failed to fetch accounts:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const filtered = results.filter(acc => parseFloat(acc.balance) > 0);
    res.status(200).json(filtered);
  });
};


module.exports = {
  addBankAccount,
  createTransfer,
  getBankAccountsWithBalance,
  
}
