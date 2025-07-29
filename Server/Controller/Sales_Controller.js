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
    commission_percent,
    farmer_expenses = [],
    buyer_expenses = [],
    installments = [],
    upfront_payment,
    payment_mode,
    selected_bank_account,
    total_buyer_payable,
  } = req.body;

  db.beginTransaction((err) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Transaction start failed", details: err });

    const saleQuery = `
      INSERT INTO sales (farmer_id, buyer_id, crop, arrival_date, weight, rate, commission_percent ,  total_buyer_payable)
      VALUES (?, ?, ?, ?, ?, ?, ?  , ?)
    `;
    const saleData = [
      farmer_id,
      buyer_id,
      crop,
      arrival_date,
      weight,
      rate,
      commission_percent,
      total_buyer_payable,
    ];

    db.query(saleQuery, saleData, (err, saleResult) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: "Sale insert failed", details: err });
        });
      }

      const sale_id = saleResult.insertId;

      // Prepare farmer expenses
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
        commission_percent,
      ]);

      // Prepare buyer expenses
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

      // Prepare buyer installments
      const buyerInstallmentsQuery = `
        INSERT INTO buyer_installments (sale_id, amount, due_date, status)
        VALUES ?
      `;
      const buyerInstallmentsValues = installments.map((inst) => [
        sale_id,
        inst.amount,
        inst.dueDate || new Date(), // fallback to current date if empty
        "pending",
      ]);

      // Insert helpers
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
              res.status(500).json({
                error: "Buyer installments insert failed",
                details: err,
              });
            });
          }
          cb();
        });
      };

      const insertUpfrontPayment = (cb) => {
        if (!upfront_payment || upfront_payment <= 0) return cb();

        const upfrontPaymentQuery = `
    INSERT INTO buyer_payments (
      buyer_id,
      amount,
      date,
      payment_mode,
      payment_type,
      reference_no,
      notes
    ) VALUES (?, ?, CURDATE(), 'cash', 'upfront', NULL, 'Auto-recorded upfront payment')
  `;

        const upfrontValues = [buyer_id, upfront_payment];

        db.query(upfrontPaymentQuery, upfrontValues, (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({
                error: "Upfront payment insert failed",
                details: err,
              });
            });
          }
          cb();
        });
      };

      // Run inserts in sequence
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

module.exports = {
  GetAllCrops,
  addSaleLot,
};
