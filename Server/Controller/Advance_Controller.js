const db = require("../config/db");
const { saveFile } = require("../Utility/FileUploder");


const createAdvance = async (req, res) => {
  const {
    farmer_id,
    type,
    date,
    amount,
    bank_account_id,
    reference_no,
    received_by,
    purchases,
  } = req.body;

  // Step 1: Get source_type from accounts table
  const accountQuery = `SELECT type FROM accounts WHERE id = ? LIMIT 1`;
  db.query(accountQuery, [bank_account_id], (accountErr, accountResults) => {
    if (accountErr || accountResults.length === 0) {
      console.error("Account fetch error:", accountErr);
      return res.status(400).json({ message: "Invalid bank_account_id or account not found" });
    }

    const source_type = accountResults[0].type; // 'bank' or 'cashbox'

    // Step 2: Insert into advances
    const advanceSql = `
      INSERT INTO advances 
      (farmer_id, type, date, amount, source_type, bank_account_id, reference_no, received_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const advanceValues = [
      farmer_id,
      type,
      date,
      amount,
      source_type || null,
      bank_account_id || null,
      reference_no || null,
      received_by || null,
    ];

    db.query(advanceSql, advanceValues, async (err, advanceResult) => {
      if (err) {
        console.error("Advance insert error:", err);
        return res.status(500).json({ message: "Failed to insert advance" });
      }

      const advanceId = advanceResult.insertId;

      // Step 3: Handle in-kind purchases
      if (type === "in_kind" && Array.isArray(purchases)) {
        try {
          for (const item of purchases) {
            const {
              vendor_id,
              category,
              description,
              total_amount,
              payment_mode,
              paid_now,
              funding_source,
              bank_account_id,
              reference_no,
            } = item;

            let invoice_url = null;
            const fileKey = `invoice_${vendor_id}`;
            const invoiceFile = req.files?.find((f) => f.fieldname === fileKey);

            if (invoiceFile) {
              invoice_url = saveFile(invoiceFile, "invoices");
            }

            const purchaseSql = `
              INSERT INTO in_kind_purchases 
              (advance_id, vendor_id, category, description, total_amount, payment_mode, paid_now, funding_source, bank_account_id, reference_no, invoice_file_url)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const purchaseValues = [
              advanceId,
              vendor_id,
              category,
              description || null,
              total_amount,
              payment_mode,
              paid_now || 0,
              funding_source || null,
              bank_account_id || null,
              reference_no || null,
              invoice_url,
            ];

            await new Promise((resolve, reject) => {
              db.query(purchaseSql, purchaseValues, (err) => {
                if (err) return reject(err);
                resolve();
              });
            });
          }
        } catch (purchaseErr) {
          console.error("Error inserting purchases:", purchaseErr);
          return res.status(500).json({ message: "Failed to insert purchases", error: purchaseErr.message });
        }
      }

      res.status(201).json({ message: "Advance created successfully", advanceId });
    });
  });
};


module.exports = {
  createAdvance,

};