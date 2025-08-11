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
    v.id AS id,
    v.name AS VendorName,
    v.type AS Type,
    COALESCE(p.total_purchase, 0) - COALESCE(pay.total_paid, 0) AS NetPayable,
    p.LastPurchase,
    pay.LastPayment
FROM vendors v
LEFT JOIN (
    SELECT 
        vendor_id,
        SUM(total_amount - IFNULL(paid_now, 0)) AS total_purchase,
        MAX(a.date) AS LastPurchase
    FROM in_kind_purchases ikp
    LEFT JOIN advances a ON ikp.advance_id = a.id
    GROUP BY vendor_id
) p ON v.id = p.vendor_id
LEFT JOIN (
    SELECT 
        vendor_id,
        SUM(amount) AS total_paid,
        MAX(payment_date) AS LastPayment
    FROM vendors_payments
    GROUP BY vendor_id
) pay ON v.id = pay.vendor_id
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

  const vendorQuery = `
    SELECT 
      v.name,
      v.type,
      COALESCE(SUM(ik.total_amount - IFNULL(ik.paid_now, 0)), 0) 
        - COALESCE(SUM(vp.amount), 0) AS netPayable
    FROM vendors v
    LEFT JOIN in_kind_purchases ik ON ik.vendor_id = v.id
    LEFT JOIN vendors_payments vp ON vp.vendor_id = v.id
    WHERE v.id = ?
    GROUP BY v.id
  `;

  db.query(vendorQuery, [id], (err, details) => {
    if (err) return res.status(500).json({ message: "Error While Fetching Vendor Details" });
    if (!details.length) return res.status(404).json({ message: "Vendor not found" });

    vendor.name = details[0].name;
    vendor.type = details[0].type;
    vendor.netPayable = details[0].netPayable;


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

const AddPaymentVendor = (req, res) => {
  const { vendor_id, amount, payment_mode, payment_date, refrence_no, upload_proof, notes } = req.body;

  // Pehle vendor ka tenant_id nikal lo
  db.query("SELECT tenant_id FROM vendors WHERE id = ?", [vendor_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error fetching tenant_id" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const tenant_id = result[0].tenant_id;

    // Ab insert query chalao
    const query = `
      INSERT INTO vendors_payments 
      (tenant_id, vendor_id, amount, payment_mode, payment_date, refrence_no, upload_proof, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [tenant_id, vendor_id, amount, payment_mode, payment_date, refrence_no, upload_proof, notes], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error While Adding Payment" });
      }
      res.json(result);
    });
  });
};




module.exports = {
  RegisterVendor,
  getVendor,
  GetVendorList,
  VendorProfile,
  AddPaymentVendor
};
