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

const getVendor = (req, res) => {
  const sql = "SELECT * FROM vendors";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching vendors:", err);
      return res.status(500).json({ error: "Failed to fetch vendors" });
    }

    res.status(200).json(results);
  });
};

const GetVendorList = (req, res) => {
  const query = `
SELECT 
    v.id AS id,   -- 👈 Ye add karein
    v.name AS VendorName,
    v.type AS Type,
    SUM(ikp.total_amount - IFNULL(ikp.paid_now, 0)) AS NetPayable,
    MAX(a.date) AS LastPurchase,
    MAX(CASE 
            WHEN ikp.paid_now > 0 THEN a.date
        END) AS LastPayment
FROM vendors v
LEFT JOIN in_kind_purchases ikp 
    ON v.id = ikp.vendor_id
LEFT JOIN advances a
    ON ikp.advance_id = a.id
GROUP BY v.id, v.name, v.type
ORDER BY v.name;
  `;
  db.query(query, (err, result) => {
    if (err) {
      console.log(error);
      res.status(500).json({ message: "Error While Fetching" });
    }
    res.json(result);
  });
};

const VendorProfile = (req, res) => {
  const id = req.params.id;

  let vendor = {
    name: "",
    type: "",
    contacts: [],
    bankAccounts: [],
    wallets: [],
    netPayable: 0,
    purchases: [],
    payments: []
  };

  db.query("SELECT name, type FROM vendors WHERE id = ?", [id], (err, details) => {
    if (err) return res.status(500).json({ message: "Error While Fetching Vendor Details" });
    if (!details.length) return res.status(404).json({ message: "Vendor not found" });

    vendor.name = details[0].name;
    vendor.type = details[0].type;

    db.query("SELECT phone_number FROM vendor_contacts WHERE vendor_id = ?", [id], (err, contacts) => {
      if (err) return res.status(500).json({ message: "Error While Fetching Vendor Contacts" });
      vendor.contacts = contacts.map(c => c.phone_number);

      db.query("SELECT bank_name AS bank, account_number AS account, iban FROM vendor_bank_accounts WHERE vendor_id = ?", [id], (err, bankAccounts) => {
        if (err) return res.status(500).json({ message: "Error While Fetching Vendor Bank Accounts" });
        vendor.bankAccounts = bankAccounts;

        db.query("SELECT provider, wallet_number AS number FROM vendor_wallets WHERE vendor_id = ?", [id], (err, wallets) => {
          if (err) return res.status(500).json({ message: "Error While Fetching Vendor Wallets" });
          vendor.wallets = wallets;

          const purchaseQuery = `
            SELECT 
              ik.id,
              DATE_FORMAT(a.date, '%d-%b') AS date,
              ik.description,
              ik.total_amount AS amount,
              ik.paid_now AS paid,
              (ik.total_amount - ik.paid_now) AS balance
            FROM in_kind_purchases ik
            LEFT JOIN advances a ON a.id = ik.advance_id
            WHERE ik.vendor_id = ?
          `;
          db.query(purchaseQuery, [id], (err, purchases) => {
            if (err) return res.status(500).json({ message: "Error While Fetching Purchases" });
            vendor.purchases = purchases;
            vendor.netPayable = purchases.reduce((sum, p) => sum + p.balance, 0);

            const paymentQuery = `
              SELECT
                vp.id,
                DATE_FORMAT(vp.payment_date, '%d-%b') AS date,
                vp.amount,
                vp.payment_mode AS mode,
                vb.bank_name AS bank,
                vp.refrence_no AS ref,
                vp.notes
              FROM vendors_payments vp
              LEFT JOIN vendor_bank_accounts vb ON vb.vendor_id = vp.vendor_id
              WHERE vp.vendor_id = ?
            `;
            db.query(paymentQuery, [id], (err, payments) => {
              if (err) return res.status(500).json({ message: "Error While Fetching Payments" });
              vendor.payments = payments;

              res.json(vendor);
            });
          });
        });
      });
    });
  });
};



module.exports = {
  RegisterVendor,
  getVendor,
  GetVendorList,
  VendorProfile,
};
