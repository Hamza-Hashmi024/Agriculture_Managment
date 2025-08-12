const db = require("../config/db");


const AddExpenses = (req, res) => {
  let {
    category,
    vendor_id,
    description,
    amount,
    paid_now,
    payment_mode, 
    bank_account_id,
    reference_no,
    invoice_file_url,
  } = req.body;

  // Determine paid_status
  let paid_status = 'credit';
  if (Number(paid_now) >= Number(amount)) {
    paid_status = 'paid';
  } else if (Number(paid_now) > 0) {
    paid_status = 'partial';
  }

  const query = `
    INSERT INTO expenses 
    (category, vendor_id, description, amount, paid_status, payment_mode, paid_now,
     bank_account_id, reference_no, invoice_file_url) 
    VALUES (?,?,?,?,?,?,?,?,?,?)`;

  const values = [
    category,
    vendor_id,
    description,
    amount,
    paid_status,
    payment_mode, // stored exactly as selected in UI
    paid_now,
    bank_account_id,
    reference_no,
    invoice_file_url,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error in database query", error: err });
    }
    res.json(result);
  });
};

const GetAllExpenses = (req , res) =>{
    const query = "SELECT * FROM expenses";
    db.query(query, (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json({message: "Error in database query", error: err})
        }
        res.json(result);
    })
}

const EditExpense = (req, res) => {
  const { id } = req.params;
  let {
    category,
    vendor_id,
    description,
    amount,
    paid_now,
    payment_mode,
    bank_account_id,
    reference_no,
    invoice_file_url,
  } = req.body;

  // Determine paid_status
  let paid_status = "credit";
  if (Number(paid_now) >= Number(amount)) {
    paid_status = "paid";
  } else if (Number(paid_now) > 0) {
    paid_status = "partial";
  }

  const query = `
    UPDATE expenses 
    SET category = ?, vendor_id = ?, description = ?, amount = ?, paid_status = ?, 
        payment_mode = ?, paid_now = ?, bank_account_id = ?, reference_no = ?, invoice_file_url = ?
    WHERE id = ?`;

  const values = [
    category,
    vendor_id,
    description,
    amount,
    paid_status,
    payment_mode,
    paid_now,
    bank_account_id,
    reference_no,
    invoice_file_url,
    id,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error in database query", error: err });
    }
    res.json({ message: "Expense updated successfully", result });
  });
};

module.exports ={
    AddExpenses,
    GetAllExpenses,
    EditExpense
}