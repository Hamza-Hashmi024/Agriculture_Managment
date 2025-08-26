const db = require("../config/db");

const GetAllCrops = (req, res) => {
  db.query("SELECT * FROM crops", (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
};

const addSaleLot = (req, res) => {
  const {
    farmer_id,
    buyer_id,
    crop,
    arrival_date,
    weight,
    rate,
    commission_percentage,
    farmer_expenses = [],
    buyer_expenses = [],
    installments = [],
    upfront_payment,
    payment_mode, // cash | bank | check
    selected_bank_account,
    total_buyer_payable,
    cheque_no: chequeNo,
    cheque_date: chequeDate,
    bank_name: bankName,
  } = req.body;

  const normalizedCommission = parseFloat(commission_percentage || 0);

  db.beginTransaction((err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Transaction start failed", details: err });
    }

    // -------------------------------
    // Insert Sale
    // -------------------------------
    const saleQuery = `
      INSERT INTO sales 
      (farmer_id, buyer_id, crop, arrival_date, weight, rate, commission_percent, total_buyer_payable)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const saleData = [
      farmer_id,
      buyer_id,
      crop,
      arrival_date,
      weight,
      rate,
      normalizedCommission,
      total_buyer_payable,
    ];

    db.query(saleQuery, saleData, (err, saleResult) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: "Sale insert failed", details: err });
        });
      }

      const sale_id = saleResult.insertId;

      // -------------------------------
      // Farmer Expenses
      // -------------------------------
      const farmerExpenseQuery = `
        INSERT INTO sale_farmer_expenses 
        (sale_id, farmer_id, buyer_id, description, amount, source_type, bank_account_id, reference_no, commission_percent) 
        VALUES ?
      `;
      const farmerExpenseValues = farmer_expenses.map((exp) => [
        sale_id,
        farmer_id,
        buyer_id,
        exp.description === "other" ? exp.customDescription : exp.description,
        exp.amount,
        exp.source,
        exp.source === "bank" ? exp.bankAccount : null,
        exp.refNo || null,
        normalizedCommission,
      ]);

      // -------------------------------
      // Buyer Expenses
      // -------------------------------
      const buyerExpenseQuery = `
        INSERT INTO sale_buyer_expenses 
        (sale_id, description, amount, source_type, bank_account_id, reference_no) 
        VALUES ?
      `;
      const buyerExpenseValues = buyer_expenses.map((exp) => [
        sale_id,
        exp.description === "other" ? exp.customDescription : exp.description,
        exp.amount,
        exp.source,
        exp.source === "bank" ? exp.bankAccount : null,
        exp.refNo || null,
      ]);

      // -------------------------------
      // Buyer Installments
      // -------------------------------
      const buyerInstallmentsQuery = `
        INSERT INTO buyer_installments (sale_id, amount, due_date, status)
        VALUES ?
      `;
      const buyerInstallmentsValues = installments.map((inst) => [
        sale_id,
        inst.amount,
        inst.dueDate,
        "pending",
      ]);

      // -------------------------------
      // Insert Helpers
      // -------------------------------
      const insertFarmerExpenses = (cb) => {
        if (farmerExpenseValues.length === 0) return cb();
        db.query(farmerExpenseQuery, [farmerExpenseValues], (err) => {
          if (err) {
            return db.rollback(() => {
              res
                .status(500)
                .json({ error: "Farmer expenses insert failed", details: err });
            });
          }
          cb();
        });
      };

      const insertBuyerExpenses = (cb) => {
        if (buyerExpenseValues.length === 0) return cb();
        db.query(buyerExpenseQuery, [buyerExpenseValues], (err) => {
          if (err) {
            return db.rollback(() => {
              res
                .status(500)
                .json({ error: "Buyer expenses insert failed", details: err });
            });
          }
          cb();
        });
      };

      const insertBuyerInstallments = (cb) => {
        if (buyerInstallmentsValues.length === 0) return cb();
        db.query(buyerInstallmentsQuery, [buyerInstallmentsValues], (err) => {
          if (err) {
            return db.rollback(() => {
              res
                .status(500)
                .json({
                  error: "Buyer installments insert failed",
                  details: err,
                });
            });
          }
          cb();
        });
      };

      // -------------------------------
      // Upfront Payment + Check Details
      // -------------------------------
      const insertUpfrontPayment = (cb) => {
        if (!upfront_payment || upfront_payment <= 0) return cb();

        const upfrontPaymentQuery = `
          INSERT INTO buyer_payments (
            buyer_id,
            amount,
            date,
            payment_mode,
            payment_type,
            bank_account_id,
            reference_no,
            notes
          ) VALUES (?, ?, CURDATE(), ?, 'upfront', ?, NULL, 'Auto upfront payment')
        `;

        const upfrontValues = [
          buyer_id,
          upfront_payment,
          payment_mode, // cash | bank | check
          selected_bank_account || null,
        ];

        db.query(upfrontPaymentQuery, upfrontValues, (err, result) => {
          if (err) {
            return db.rollback(() => {
              res
                .status(500)
                .json({ error: "Upfront payment insert failed", details: err });
            });
          }

          const buyerPaymentId = result.insertId;

          //  Only if payment mode is check
          if (payment_mode === "check") {
            const checkQuery = `
              INSERT INTO buyer_payment_checks 
              (buyer_payment_id, payment_type, cheque_no, cheque_date, bank_name)
              VALUES (?, 'upfront', ?, ?, ?)
            `;

            const checkValues = [
              buyerPaymentId,
              chequeNo,
              chequeDate,
              bankName,
            ];

            db.query(checkQuery, checkValues, (err) => {
              if (err) {
                return db.rollback(() => {
                  res
                    .status(500)
                    .json({ error: "Check insert failed", details: err });
                });
              }
              cb();
            });
          } else {
            cb();
          }
        });
      };

      // -------------------------------
      // Run Inserts in Sequence
      // -------------------------------
      insertFarmerExpenses(() => {
        insertBuyerExpenses(() => {
          insertBuyerInstallments(() => {
            insertUpfrontPayment(() => {
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    res
                      .status(500)
                      .json({ error: "Commit failed", details: err });
                  });
                }
                res.status(200).json({
                  message: "Sale lot recorded successfully",
                  sale_id,
                });
              });
            });
          });
        });
      });
    });
  });
};

const GetSalesList = (req, res) => {
  const query = `
    SELECT 
      sales.id,
      farmers.name AS farmer_name,
      buyers.name AS buyer_name,
      sales.crop,
      sales.arrival_date,
      sales.weight,
      sales.rate,
      sales.commission_percent,
      sales.status,
      sales.total_buyer_payable,
      sales.created_at
    FROM sales
    INNER JOIN farmers ON sales.farmer_id = farmers.id
    INNER JOIN buyers ON sales.buyer_id = buyers.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Failed to retrieve sales list",
        details: err,
      });
    }
    res.status(200).json({
      message: "Sales list retrieved successfully",
      data: results,
    });
  });
};

module.exports = {
  GetSalesList,
  GetAllCrops,
  addSaleLot,
};
