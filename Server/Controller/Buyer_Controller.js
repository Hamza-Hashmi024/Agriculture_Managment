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
        if (!Array.isArray(contacts) || contacts.length === 0)
          return callback();

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
          db.query(
            query,
            [buyerId, wallet.provider, wallet.walletNumber],
            (err) => {
              if (err) return callback(err);
              if (++completed === wallets.length) callback();
            }
          );
        });
      };

      // 4. Insert bank accounts
      const insertBankAccounts = (callback) => {
        if (!Array.isArray(bankAccounts) || bankAccounts.length === 0)
          return callback();

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
        if (err)
          return db.rollback(() =>
            res.status(500).json({ error: "Failed to insert contacts" })
          );

        insertWallets((err) => {
          if (err)
            return db.rollback(() =>
              res.status(500).json({ error: "Failed to insert wallets" })
            );

          insertBankAccounts((err) => {
            if (err)
              return db.rollback(() =>
                res
                  .status(500)
                  .json({ error: "Failed to insert bank accounts" })
              );

            db.commit((err) => {
              if (err)
                return db.rollback(() =>
                  res.status(500).json({ error: "Commit failed" })
                );

              res
                .status(201)
                .json({ message: "Buyer registered successfully", buyerId });
            });
          });
        });
      });
    });
  });
};

const GetAllBuyers = (req, res) => {
  db.query("SELECT * FROM buyers", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch buyers" });
    }
    res.status(200).json(results);
  });
};

const GetAllBuyerBankAccounts = (req, res) => {
  const { buyerId } = req.params;

  db.query(
    "SELECT * FROM buyer_bank_accounts WHERE buyer_id = ?",
    [buyerId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch bank accounts" });
      }
      res.status(200).json(results);
    }
  );
};

const GetBuyerById = (req, res) => {
  const { buyerId } = req.params;
  db.query("SELECT * FROM buyers WHERE id = ?", [buyerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch buyer" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Buyer not found" });
    }
    res.status(200).json(results[0]);
  });
};

// const GetBuyerInstallments = (req, res) => {
//   const { buyerId } = req.params;

//   const query = `SELECT
//   bi.id AS id,
//   bi.amount AS installment_amount,
//   bi.due_date AS installment_date,
//   bi.status AS status,
//   COALESCE(SUM(bpi.amount), 0) AS paid_amount,
//   (bi.amount - COALESCE(SUM(bpi.amount), 0)) AS remaining_amount
// FROM buyer_installments bi
// JOIN sales s ON bi.sale_id = s.id
// LEFT JOIN buyer_payment_installments bpi ON bpi.buyer_installment_id = bi.id
// WHERE s.buyer_id = ?
// GROUP BY bi.id
// ORDER BY bi.due_date ASC;`;
//   db.query(query, [buyerId], (err, results) => {
//     if (err) {
//       console.error("SQL Error:", err);
//       return res.status(500).json({ error: "Failed to fetch installments" });
//     }

//     return res.status(200).json(results);
//   });
// };

const GetBuyerInstallments = (req, res) => {
  const { buyerId } = req.params;

  const query = `
    SELECT
      bi.id AS id,
      bi.amount AS installment_amount,
      bi.due_date AS installment_date,
      bi.status AS status,
      LEAST(COALESCE(SUM(bpi.amount), 0), bi.amount) AS paid_amount,
      GREATEST(bi.amount - COALESCE(SUM(bpi.amount), 0), 0) AS remaining_amount
    FROM buyer_installments bi
    JOIN sales s ON bi.sale_id = s.id
    LEFT JOIN buyer_payment_installments bpi ON bpi.buyer_installment_id = bi.id
    WHERE s.buyer_id = ?
    GROUP BY bi.id
    ORDER BY bi.due_date ASC;
  `;

  db.query(query, [buyerId], (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: "Failed to fetch installments" });
    }

    return res.status(200).json(results);
  });
};







const getBuyersWithReceivables = (req, res) => {
  const query = `
    SELECT 
      b.id AS buyerId,
      b.name AS buyerName,
      IFNULL(SUM(bi.amount), 0) AS totalBuyerPayable,
      IFNULL((
        SELECT SUM(bpi.amount)
        FROM buyer_installments bi2
        JOIN buyer_payment_installments bpi ON bpi.buyer_installment_id = bi2.id
        JOIN sales s2 ON bi2.sale_id = s2.id
        WHERE s2.buyer_id = b.id
      ), 0) AS totalPayments,
      MAX(s.arrival_date) AS lastSale,
      (
        SELECT MAX(bp.date)
        FROM buyer_installments bi3
        JOIN buyer_payment_installments bpi2 ON bpi2.buyer_installment_id = bi3.id
        JOIN buyer_payments bp ON bp.id = bpi2.buyer_payment_id
        JOIN sales s3 ON bi3.sale_id = s3.id
        WHERE s3.buyer_id = b.id
      ) AS lastPayment
    FROM buyers b
    LEFT JOIN sales s ON s.buyer_id = b.id
    LEFT JOIN buyer_installments bi ON bi.sale_id = s.id
    GROUP BY b.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching buyers with receivables:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const buyers = results
      .map((row) => {
        const totalBuyerPayable = parseFloat(row.totalBuyerPayable || 0);
        const totalPayments = parseFloat(row.totalPayments || 0);
        const remainingDue = Math.max(totalBuyerPayable - totalPayments, 0);

        return {
          buyerId: row.buyerId,
          buyerName: row.buyerName,
          totalBuyerPayable,
          totalPayments,
          remainingDue,
          lastSale: row.lastSale
            ? new Date(row.lastSale).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : null,
          lastPayment: row.lastPayment
            ? new Date(row.lastPayment).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : null,
        };
      })
      .filter(
        (buyer) => buyer.totalBuyerPayable > 0 || buyer.totalPayments > 0
      );

    return res.status(200).json(buyers);
  });
};

module.exports = {
  registerBuyer,
  GetAllBuyers,
  GetAllBuyerBankAccounts,
  GetBuyerById,
  GetBuyerInstallments,
  getBuyersWithReceivables,
};
