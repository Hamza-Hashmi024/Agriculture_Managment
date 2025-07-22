const db = require("../config/db");
const { saveFile } = require("../Utility/FileUploder");


const createAdvance = async (req, res) => {
  try {
    const {
      farmer_id,
      type,
      date,
      amount = 0,
      bank_account_id,
      reference_no,
      received_by,
      purchases = [],
    } = req.body;

    const numericAccountId = bank_account_id ? Number(bank_account_id) : null;

    // ✅ Get source_type from accounts
    let source_type = null;

    if (numericAccountId) {
      const accountQuery = `SELECT type FROM accounts WHERE id = ? LIMIT 1`;

      const [accountResults] = await new Promise((resolve, reject) => {
        db.query(accountQuery, [numericAccountId], (err, results) => {
          if (err) return reject(err);
          resolve([results]);
        });
      });

      if (!accountResults || accountResults.length === 0) {
        return res.status(400).json({ message: "Invalid bank_account_id or account not found" });
      }

      source_type = accountResults[0].type; // 'bank' or 'cashbox'
    }

    // ✅ Insert into advances
    const advanceSql = `
      INSERT INTO advances 
      (farmer_id, type, date, amount, source_type, bank_account_id, reference_no, received_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const advanceValues = [
      farmer_id,
      type === "in_kind",
      date,
      amount,
      source_type || null,
      numericAccountId,
      reference_no || null,
      received_by || null,
    ];

    const [advanceResult] = await new Promise((resolve, reject) => {
      db.query(advanceSql, advanceValues, (err, result) => {
        if (err) return reject(err);
        resolve([result]);
      });
    });

    const advanceId = advanceResult.insertId;
    const parsedPurchases = typeof purchases === "string" ? JSON.parse(purchases) : purchases;
    //  Handle in-kind purchases
if (type === "in_kind" && Array.isArray(parsedPurchases))
   {
  for (const item of parsedPurchases){
        const {
          vendor_id,
          category,
          description,
          total_amount,
          payment_mode,
          paid_now = 0,
          funding_source,
          bank_account_id: purchase_account_id,
          reference_no,
        } = item;

        const accountId = Number(purchase_account_id || funding_source);
        if (!accountId) {
          return res.status(400).json({ message: "Missing bank_account_id or funding_source in purchase item" });
        }

        // 🔍 Fetch account type for each purchase
        const [purchaseAccountResults] = await new Promise((resolve, reject) => {
          db.query(`SELECT type FROM accounts WHERE id = ? LIMIT 1`, [accountId], (err, results) => {
            if (err) return reject(err);
            resolve([results]);
          });
        });

        if (!purchaseAccountResults || purchaseAccountResults.length === 0) {
          return res.status(400).json({ message: "Invalid account ID in purchase item" });
        }

        const purchase_source_type = purchaseAccountResults[0].type;

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
          paid_now,
          purchase_source_type,
          accountId,
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
    }

    return res.status(201).json({ message: "Advance created successfully", advanceId });

  } catch (err) {
    console.error("Advance insert error:", err);
    return res.status(500).json({ message: "Failed to create advance", error: err.message });
  }
};

// const createAdvance = async (req, res) => {
//   const {
//     farmer_id,
//     type,
//     date,
//     amount,
//     bank_account_id,
//     reference_no,
//     received_by,
//     purchases,
//   } = req.body;

//   // Helper to insert the advance and its purchases
//   const insertAdvance = ({ source_type, bank_account_id }) => {
//     const advanceSql = `
//       INSERT INTO advances 
//       (farmer_id, type, date, amount, source_type, bank_account_id, reference_no, received_by)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const advanceValues = [
//       farmer_id,
//       type,
//       date,
//       amount || 0,
//       source_type || null,
//       bank_account_id || null,
//       reference_no || null,
//       received_by || null,
//     ];

//     db.query(advanceSql, advanceValues, async (err, advanceResult) => {
//       if (err) {
//         console.error("Advance insert error:", err);
//         return res.status(500).json({ message: "Failed to insert advance" });
//       }

//       const advanceId = advanceResult.insertId;

//       // Handle in-kind purchases
//       if (type === "in_kind" && Array.isArray(purchases)) {
//         try {
//           for (const item of purchases) {
//             const {
//               vendor_id,
//               category,
//               description,
//               total_amount,
//               payment_mode,
//               paid_now,
//               funding_source,
//               bank_account_id,
//               reference_no,
//             } = item;

//             let invoice_url = null;
//             const fileKey = `invoice_${vendor_id}`;
//             const invoiceFile = req.files?.find((f) => f.fieldname === fileKey);

//             if (invoiceFile) {
//               invoice_url = saveFile(invoiceFile, "invoices");
//             }

//             // Validate bank_account_id for each in-kind purchase
//             if (
//               (payment_mode === "full" || payment_mode === "partial") &&
//               bank_account_id
//             ) {
//               const accQuery = `SELECT id FROM accounts WHERE id = ? LIMIT 1`;
//               const valid = await new Promise((resolve) => {
//                 db.query(accQuery, [bank_account_id], (err, rows) => {
//                   resolve(!err && rows.length > 0);
//                 });
//               });

//               if (!valid) {
//                 return res.status(400).json({ message: `Invalid bank_account_id for vendor: ${vendor_id}` });
//               }
//             }

//             const purchaseSql = `
//               INSERT INTO in_kind_purchases 
//               (advance_id, vendor_id, category, description, total_amount, payment_mode, paid_now, funding_source, bank_account_id, reference_no, invoice_file_url)
//               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//             `;

//             const purchaseValues = [
//               advanceId,
//               vendor_id,
//               category,
//               description || null,
//               total_amount,
//               payment_mode,
//               paid_now || 0,
//               funding_source || null,
//               bank_account_id || null,
//               reference_no || null,
//               invoice_url,
//             ];

//             await new Promise((resolve, reject) => {
//               db.query(purchaseSql, purchaseValues, (err) => {
//                 if (err) return reject(err);
//                 resolve();
//               });
//             });
//           }
//         } catch (purchaseErr) {
//           console.error("Error inserting purchases:", purchaseErr);
//           return res.status(500).json({ message: "Failed to insert purchases", error: purchaseErr.message });
//         }
//       }

//       return res.status(201).json({ message: "Advance created successfully", advanceId });
//     });
//   };

//   // 🧠 Only validate account for CASH advances
//   if (type === "cash") {
//     const accountQuery = `SELECT type FROM accounts WHERE id = ? LIMIT 1`;

//     db.query(accountQuery, [bank_account_id], (accountErr, accountResults) => {
//       if (accountErr || accountResults.length === 0) {
//         console.error("Account fetch error:", accountErr);
//         return res.status(400).json({ message: "Invalid bank_account_id or account not found" });
//       }

//       const source_type = accountResults[0].type;
//       insertAdvance({ source_type, bank_account_id });
//     });
//   } else {
//     // For in-kind: skip advance-level account check
//     insertAdvance({ source_type: null, bank_account_id: null });
//   }
// };


module.exports = {
  createAdvance,

};