const db = require("../config/db");

const createEmployee = (req, res) => {
  try {
    let {
      name,
      designation,
      cnic,
      address,
      joiningDate,
      salary,
      allowance,
      tax,
      status = "Active",
      contacts = "[]",
      bankAccounts = "[]",
      wallets = "[]",
    } = req.body;

    // Parse JSON safely
    try {
      contacts = JSON.parse(contacts);
    } catch {
      contacts = [];
    }
    try {
      bankAccounts = JSON.parse(bankAccounts);
    } catch {
      bankAccounts = [];
    }
    try {
      wallets = JSON.parse(wallets);
    } catch {
      wallets = [];
    }

    const profilePhoto = req.file ? req.file.path : null;

    // Insert into employees table
    const query = `
      INSERT INTO employees 
      (name, designation, cnic, address, joining_date, salary, allowance, status, profile_photo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [name, designation, cnic, address, joiningDate, salary, allowance, status, profilePhoto],
      (err, result) => {
        if (err) {
          console.error("Employee insert error:", err.message);
          return res.status(500).json({ error: err.message });
        }

        const employeeIdInserted = result.insertId;

        // Insert contacts
        if (contacts.length > 0) {
          const contactQuery = `INSERT INTO employee_contacts (employee_id, contact) VALUES ?`;
          const contactValues = contacts.map((c) => [employeeIdInserted, c]);
          db.query(contactQuery, [contactValues], (err) => {
            if (err) console.error("Contact insert error:", err.message);
          });
        }

        // Insert bank accounts
        if (bankAccounts.length > 0) {
          const bankQuery = `INSERT INTO employee_bank_accounts (employee_id, bank_name, account_no, iban) VALUES ?`;
          const bankValues = bankAccounts.map((b) => [
            employeeIdInserted,
            b.bankName,
            b.accountNo,
            b.iban,
          ]);
          db.query(bankQuery, [bankValues], (err) => {
            if (err) console.error("Bank account insert error:", err.message);
          });
        }

        // Insert wallets
        if (wallets.length > 0) {
          const walletQuery = `INSERT INTO employee_wallets (employee_id, provider, wallet_number) VALUES ?`;
          const walletValues = wallets.map((w) => [
            employeeIdInserted,
            w.provider,
            w.number,
          ]);
          db.query(walletQuery, [walletValues], (err) => {
            if (err) console.error("Wallet insert error:", err.message);
          });
        }

        // Insert tax
        if (tax && tax !== "") {
          const taxQuery = `INSERT INTO employee_taxes (employee_id, tax_id) VALUES (?, ?)`;
          db.query(taxQuery, [employeeIdInserted, tax], (err) => {
            if (err) console.error("Tax insert error:", err.message);
          });
        }

        res.status(201).json({
          message: "Employee created successfully",
          id: employeeIdInserted,
        });
      }
    );
  } catch (error) {
    console.error("createEmployee fatal error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  createEmployee,
};