const db = require("../config/db");

const RegisterFarmer = (req, res) => {
  const {
    tenant_id,
    name,
    cnic,
    village,
    profile_photo_url,
    contacts,
    bankAccounts,
    wallets,
  } = req.body;

  // Step 1: Insert into farmers table
  const insertFarmerQuery = `
    INSERT INTO farmers (tenant_id, name, cnic, village, profile_photo_url)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertFarmerQuery,
    [tenant_id, name, cnic, village, profile_photo_url],
    (err, result) => {
      if (err) {
        console.error("Insert farmer error:", err);
        return res.status(500).send({ message: "Error saving farmer" });
      }

      const farmerId = result.insertId;

      // Step 2: Insert contacts (if any)
      const contactValues = contacts?.map((phone) => [farmerId, phone]);
      if (contactValues?.length) {
        const contactQuery = `INSERT INTO farmer_contacts (farmer_id, phone_number) VALUES ?`;
        db.query(contactQuery, [contactValues], (err) => {
          if (err) console.error("Contact insert failed:", err);
        });
      }

      // Step 3: Insert bank accounts (if any)
      const bankValues = bankAccounts?.map((acc) => [
        farmerId,
        acc.bankName,
        acc.accountNo,
        acc.iban,
      ]);
      if (bankValues?.length) {
        const bankQuery = `
        INSERT INTO farmer_bank_accounts (farmer_id, bank_name, account_number, iban) VALUES ?
      `;
        db.query(bankQuery, [bankValues], (err) => {
          if (err) console.error("Bank account insert failed:", err);
        });
      }

      // Step 4: Insert wallets (if any)
      const walletValues = wallets?.map((wallet) => [
        farmerId,
        wallet.provider,
        wallet.number,
      ]);
      if (walletValues?.length) {
        const walletQuery = `
        INSERT INTO farmer_wallets (farmer_id, provider, wallet_number) VALUES ?
      `;
        db.query(walletQuery, [walletValues], (err) => {
          if (err) console.error("Wallet insert failed:", err);
        });
      }

      return res
        .status(201)
        .send({ message: "Farmer registered successfully", farmerId });
    }
  );
};


const GetAllFarmers = (req, res) => {
  const query = `SELECT * FROM farmers`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send({ message: "Error fetching farmers" });
    }

    return res.status(200).send(results);
  });
};
module.exports = {
  RegisterFarmer,
  GetAllFarmers 

};
