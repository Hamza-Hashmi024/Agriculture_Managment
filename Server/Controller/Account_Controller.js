const db = require("../config/db");


const addBankAccount = (req, res) => {
  const {
    type,
    bank,
    title,
    account_number,
    branch,
    iban,
    opening_balance,
    opening_date,
    notes,
  } = req.body;

  // Validation
  if (
    !type ||
    !title ||
    !account_number ||
    !opening_balance ||
    !opening_date ||
    (type === "bank" && !bank)
  ) {
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
    type,
    title,
    account_number,
    branch || null,
    iban || null,
    parseFloat(opening_balance),
    opening_date,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting account:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    return res.status(201).json({
      message: `${
        type === "bank" ? "Bank" : "Cashbox"
      } account added successfully`,
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
              return res.status(500).json({
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

const getAccountsWithBalance = (req, res) => {
  const query = `
    SELECT id, title, type, opening_balance AS balance 
    FROM accounts 
    WHERE opening_balance > 0
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Failed to fetch accounts:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  });
};


const getAllCashBoxTransaction = (req, res) => {
  // 1. Get opening balance
  const openingBalanceQuery = `
    SELECT COALESCE(SUM(opening_balance), 0) AS opening_balance
    FROM accounts
    WHERE type = 'cashbox'
  `;

  db.query(openingBalanceQuery, (err, obResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching opening balance" });
    }

    const openingBalance = obResult[0].opening_balance;
    let runningBalance = openingBalance;

    // 2. Get all transactions (without SET variables)
    const ledgerQuery = `
      SELECT u.date, u.description, u.debit, u.credit
      FROM (
        SELECT a.date AS date,
               CONCAT('Advance to Farmer #', f.name) AS description,
               a.amount AS debit,
               0 AS credit
        FROM advances a
        JOIN farmers f ON a.farmer_id = f.id
        WHERE a.source_type = 'cashbox'

        UNION ALL

        SELECT e.created_at AS date,
               CONCAT('Expense: ', COALESCE(e.description, '')) AS description,
               e.amount AS debit,
               0 AS credit
        FROM expenses e
        WHERE e.payment_mode = 'cashbox'

        UNION ALL

        SELECT s.arrival_date AS date,
               CONCAT('Farmer Expense (Sale#', s.id, '): ', COALESCE(sfe.description, '')) AS description,
               sfe.amount AS debit,
               0 AS credit
        FROM sale_farmer_expenses sfe
        JOIN sales s ON sfe.sale_id = s.id
        WHERE sfe.source_type = 'cashbox'

        UNION ALL

        SELECT s.arrival_date AS date,
               CONCAT('Buyer Expense (Sale#', s.id, '): ', COALESCE(sbe.description, '')) AS description,
               sbe.amount AS debit,
               0 AS credit
        FROM sale_buyer_expenses sbe
        JOIN sales s ON sbe.sale_id = s.id
        WHERE sbe.source_type = 'cashbox'

        UNION ALL

        SELECT vp.payment_date AS date,
               CONCAT('Vendor Payment: ', COALESCE(v.name, '')) AS description,
               vp.amount AS debit,
               0 AS credit
        FROM vendors_payments vp
        JOIN vendors v ON vp.vendor_id = v.id
        WHERE vp.payment_mode = 'cash'

        UNION ALL

        SELECT fp.date AS date,
               CONCAT('Payment to Farmer: ', COALESCE(f.name, '')) AS description,
               fp.amount AS debit,
               0 AS credit
        FROM farmer_payments fp
        JOIN farmers f ON fp.farmer_id = f.id
        WHERE fp.payment_mode = 'cash'

        UNION ALL

        SELECT bp.date AS date,
               CONCAT('Payment from Buyer: ', COALESCE(b.name, '')) AS description,
               0 AS debit,
               bp.amount AS credit
        FROM buyer_payments bp
        JOIN buyers b ON bp.buyer_id = b.id
        WHERE bp.payment_mode = 'cash'

        UNION ALL

        SELECT t.date AS date,
               CONCAT('Account Transaction: ', COALESCE(t.description, '')) AS description,
               COALESCE(t.debit, 0) AS debit,
               COALESCE(t.credit, 0) AS credit
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        WHERE a.type = 'cashbox'

        UNION ALL

        SELECT at.date AS date,
               CONCAT('Transfer to ', COALESCE(to_acc.title, 'account')) AS description,
               at.amount AS debit,
               0 AS credit
        FROM account_transfers at
        JOIN accounts from_acc ON at.from_account_id = from_acc.id
        JOIN accounts to_acc   ON at.to_account_id   = to_acc.id
        WHERE from_acc.type = 'cashbox'

        UNION ALL

        SELECT at.date AS date,
               CONCAT('Transfer from ', COALESCE(from_acc.title, 'account')) AS description,
               0 AS debit,
               at.amount AS credit
        FROM account_transfers at
        JOIN accounts from_acc ON at.from_account_id = from_acc.id
        JOIN accounts to_acc   ON at.to_account_id   = to_acc.id
        WHERE to_acc.type = 'cashbox'
      ) u
      ORDER BY u.date ASC, u.description
    `;

    db.query(ledgerQuery, (err, ledgerRows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching ledger" });
      }

      // Calculate running balance in JS
      const ledgerWithBalance = ledgerRows.map(row => {
        runningBalance += (row.credit - row.debit);
        return { ...row, balance: runningBalance };
      });

      res.json({
        opening_balance: openingBalance,
        transactions: ledgerWithBalance
      });
    });
  });
};



module.exports = {
  addBankAccount,
  createTransfer,
  getAccountsWithBalance,
  getAllCashBoxTransaction
};
