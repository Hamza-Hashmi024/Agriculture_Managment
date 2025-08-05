const db = require("../config/db");

const registerBuyer = (req, res) => {
  const { tenantId, name, notes, address, contacts, wallets, bankAccounts } =
    req.body;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to start transaction" });
    }

    // 1. Insert buyer
    const buyerQuery = `INSERT INTO buyers (tenant_id, name, notes, address) VALUES (?, ?, ?, ?)`;
    db.query(
      buyerQuery,
      [tenantId, name, notes, address],
      (err, buyerResult) => {
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
          if (!Array.isArray(wallets) || wallets.length === 0)
            return callback();

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
      }
    );
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
    WHERE s.buyer_id = ? AND bi.status IN ('partial', 'pending')
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

const GetAllBuyersWithRecivables = (req, res) => {
  const query = `SELECT 
    b.name AS buyer_name,
    IFNULL(SUM(s.total_buyer_payable), 0) - IFNULL(SUM(p.amount), 0) AS net_receivable,
    MAX(s.arrival_date) AS last_sale_date,
    MAX(p.date) AS last_payment_date
  FROM buyers b
  LEFT JOIN sales s ON b.id = s.buyer_id
  LEFT JOIN buyer_payments p ON b.id = p.buyer_id
  GROUP BY b.id, b.name;`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching buyers with receivables:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const buyers = result
      .map((row) => ({
        buyerName: row.buyer_name,
        netReceivable: parseFloat(row.net_receivable || 0),
        lastSaleDate: row.last_sale_date
          ? new Date(row.last_sale_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : null,
        lastPaymentDate: row.last_payment_date
          ? new Date(row.last_payment_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : null,
      }))
      .filter(
        (buyer) =>
          buyer.netReceivable > 0 || buyer.lastSaleDate || buyer.lastPaymentDate
      )
      .sort((a, b) => b.netReceivable - a.netReceivable);

    res.status(200).json(buyers);
  });
};

const getBuyerDetails = (req, res) => {
  const buyerId = req.params.id;

  // Step 1: Get buyer basic info
  const buyerQuery = `SELECT * FROM buyers WHERE id = ?`;
  db.query(buyerQuery, [buyerId], (err, buyerResult) => {
    if (err) return res.status(500).json({ error: err.message });
    if (buyerResult.length === 0)
      return res.status(404).json({ error: "Buyer not found" });

    const buyer = buyerResult[0];

    // Step 2: Get contacts
    const contactsQuery = `SELECT phone_number FROM buyer_contacts WHERE buyer_id = ?`;
    db.query(contactsQuery, [buyerId], (err, contactsResult) => {
      if (err) return res.status(500).json({ error: err.message });

      // Step 3: Get bank accounts
      const bankQuery = `SELECT bank_name, account_number, iban FROM buyer_bank_accounts WHERE buyer_id = ?`;
      db.query(bankQuery, [buyerId], (err, bankResult) => {
        if (err) return res.status(500).json({ error: err.message });

        // Step 4: Get wallet info
        const walletQuery = `SELECT provider AS walletType, wallet_number FROM buyer_wallets WHERE buyer_id = ?`;
        db.query(walletQuery, [buyerId], (err, walletResult) => {
          if (err) return res.status(500).json({ error: err.message });

          // Step 5: Get invoices
          const invoiceQuery = `
            SELECT s.id, s.arrival_date AS date, s.crop, CONCAT('#INV', s.id) AS invoiceNo, s.total_buyer_payable AS amount
            FROM sales s
            WHERE s.buyer_id = ?
          `;
          db.query(invoiceQuery, [buyerId], (err, invoiceResult) => {
            if (err) return res.status(500).json({ error: err.message });

            // Step 6: Get installments
            const installmentQuery = `
              SELECT bi.id, CONCAT('#INV', bi.sale_id) AS invoiceNo, bi.amount, bi.due_date, bi.status
              FROM buyer_installments bi
              JOIN sales s ON s.id = bi.sale_id
              WHERE s.buyer_id = ?
            `;
            db.query(installmentQuery, [buyerId], (err, installmentResult) => {
              if (err) return res.status(500).json({ error: err.message });

              // Step 7: Get payments
              const paymentQuery = `
  SELECT bp.id, bp.date, bp.amount, bp.payment_mode AS mode, 
         IFNULL(a.bank, '—') AS bank, bp.reference_no AS refNo, bp.notes
  FROM buyer_payments bp
  LEFT JOIN accounts a ON a.id = bp.bank_account_id
  WHERE bp.buyer_id = ?
`;
              db.query(paymentQuery, [buyerId], (err, paymentResult) => {
                if (err) return res.status(500).json({ error: err.message });

                // Step 8: Calculate net receivable
                const totalInvoice = invoiceResult.reduce(
                  (sum, inv) => sum + parseFloat(inv.amount),
                  0
                );
                const totalPayments = paymentResult.reduce(
                  (sum, pay) => sum + parseFloat(pay.amount),
                  0
                );
                const netReceivable = totalInvoice - totalPayments;

                const response = {
                  id: buyer.id.toString(),
                  name: buyer.name,
                  contacts: contactsResult.map((c) => c.phone_number),
                  bankName: bankResult[0]?.bank_name || "",
                  accountNo: bankResult[0]?.account_number || "",
                  iban: bankResult[0]?.iban || "",
                  walletNumber: walletResult[0]?.wallet_number || "",
                  walletType: walletResult[0]?.walletType || "",
                  netReceivable,
                  invoices: invoiceResult,
                  installments: installmentResult,
                  payments: paymentResult,
                };

                return res.json(response);
              });
            });
          });
        });
      });
    });
  });
};

module.exports = {
  registerBuyer,
  GetAllBuyers,
  GetAllBuyerBankAccounts,
  GetBuyerById,
  GetBuyerInstallments,
  getBuyersWithReceivables,
  GetAllBuyersWithRecivables,
  getBuyerDetails,
};
