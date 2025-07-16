const db = require("../config/db");

const registerBuyer = (req, res) => {
  const { tenantId, name, notes, contacts, wallets, bankAccounts } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to start transaction" });
    }

    // 1. Insert buyer
    const buyerQuery = `INSERT INTO buyers (tenant_id, name, notes) VALUES (?, ?, ?)`;
    db.query(buyerQuery, [tenantId, name, notes], (err, buyerResult) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: "Failed to insert buyer" });
        });
      }

      const buyerId = buyerResult.insertId;

      // 2. Insert contacts
      const insertContacts = (callback) => {
        if (!Array.isArray(contacts) || contacts.length === 0) return callback();

        let completed = 0;
        contacts.forEach((contact) => {
          const query = `INSERT INTO buyer_contacts (buyer_id, phone_number) VALUES (?, ?)`;
          db.query(query, [buyerId, contact.phoneNumber], (err) => {
            if (err) return callback(err);
            if (++completed === contacts.length) callback();
          });
        });
      };

      // 3. Insert wallets
      const insertWallets = (callback) => {
        if (!Array.isArray(wallets) || wallets.length === 0) return callback();

        let completed = 0;
        wallets.forEach((wallet) => {
          const query = `INSERT INTO buyer_wallets (buyer_id, provider, wallet_number) VALUES (?, ?, ?)`;
          db.query(query, [buyerId, wallet.provider, wallet.walletNumber], (err) => {
            if (err) return callback(err);
            if (++completed === wallets.length) callback();
          });
        });
      };

      // 4. Insert bank accounts
      const insertBankAccounts = (callback) => {
        if (!Array.isArray(bankAccounts) || bankAccounts.length === 0) return callback();

        let completed = 0;
        bankAccounts.forEach((account) => {
          const query = `INSERT INTO buyer_bank_accounts (buyer_id, bank_name, account_number, iban) VALUES (?, ?, ?, ?)`;
          db.query(
            query,
            [buyerId, account.bankName, account.accountNumber, account.iban],
            (err) => {
              if (err) return callback(err);
              if (++completed === bankAccounts.length) callback();
            }
          );
        });
      };

      // Run all inserts in series
      insertContacts((err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: "Failed to insert contacts" }));

        insertWallets((err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: "Failed to insert wallets" }));

          insertBankAccounts((err) => {
            if (err) return db.rollback(() => res.status(500).json({ error: "Failed to insert bank accounts" }));

            db.commit((err) => {
              if (err) return db.rollback(() => res.status(500).json({ error: "Commit failed" }));

              res.status(201).json({ message: "Buyer registered successfully", buyerId });
            });
          });
        });
      });
    });
  });
};

module.exports = {
  registerBuyer,
};