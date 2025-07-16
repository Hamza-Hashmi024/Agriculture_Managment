const db = require("../config/db");

const RegisterVendor = (req, res) => {
  const {
    tenant_id,
    name,
    type,
    notes,
    contacts = [],
    bankAccounts = [],
    wallets = [],
  } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to start transaction" });
    }

    const insertVendorQuery = `INSERT INTO vendors (tenant_id, name, type, notes) VALUES (?, ?, ?, ?)`;
    db.query(
      insertVendorQuery,
      [tenant_id, name, type, notes],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error("Vendor insert error:", err);
            res.status(500).json({ error: "Failed to insert vendor" });
          });
        }

        const vendorId = result.insertId;

        const insertContacts = (callback) => {
          if (!contacts.length) return callback();
          let completed = 0;
          contacts.forEach((phone) => {
            const query = `INSERT INTO vendor_contacts (vendor_id, phone_number) VALUES (?, ?)`;
            db.query(query, [vendorId, phone], (err) => {
              if (err) return callback(err);
              if (++completed === contacts.length) callback();
            });
          });
        };

        const insertBankAccounts = (callback) => {
          if (!bankAccounts.length) return callback();
          let completed = 0;
          bankAccounts.forEach((account) => {
            const { bankName, accountNo, iban } = account;
            const query = `INSERT INTO vendor_bank_accounts (vendor_id, bank_name, account_number, iban) VALUES (?, ?, ?, ?)`;
            db.query(query, [vendorId, bankName, accountNo, iban], (err) => {
              if (err) return callback(err);
              if (++completed === bankAccounts.length) callback();
            });
          });
        };

        const insertWallets = (callback) => {
          if (!wallets.length) return callback();
          let completed = 0;
          wallets.forEach((wallet) => {
            const { provider, number } = wallet;
            const query = `INSERT INTO vendor_wallets (vendor_id, provider, wallet_number) VALUES (?, ?, ?)`;
            db.query(query, [vendorId, provider, number], (err) => {
              if (err) return callback(err);
              if (++completed === wallets.length) callback();
            });
          });
        };

        // Insert in sequence
        insertContacts((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Contacts insert error:", err);
              res.status(500).json({ error: "Failed to insert contacts" });
            });
          }

          insertBankAccounts((err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Bank accounts insert error:", err);
                res
                  .status(500)
                  .json({ error: "Failed to insert bank accounts" });
              });
            }

            insertWallets((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Wallets insert error:", err);
                  res.status(500).json({ error: "Failed to insert wallets" });
                });
              }

              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    res
                      .status(500)
                      .json({ error: "Transaction commit failed" });
                  });
                }

                res.status(201).json({
                  message: "Vendor registered successfully",
                  vendorId,
                });
              });
            });
          });
        });
      }
    );
  });
};

module.exports = {
  RegisterVendor,
};
