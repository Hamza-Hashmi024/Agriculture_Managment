const db = require("../config/db");


const AddExpenses = (req, res) => {
  let {
    category,
    vendor_id,
    description,
    amount,
    paid_now,
    payment_mode, // comes directly from frontend select
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

// const AddExpensse = (req, res) => {
//   const {
//     category,
//     vendor_id,
//     description,
//     amount,
//     paid_status,
//     payment_mode,
//     paid_now,
//     bank_account_id,
//     reference_no,
//     invoice_file_url,
//   } = req.body;

//   const query = `insert into expenses (category , vendor_id ,  description , amount  ,  paid_status ,  payment_mode , paid_now ,
//        bank_account_id ,  reference_no , invoice_file_url ) 
//         VALUES (?,?,?,?,?,?,?,?,?,?)`;
//   const values = [
//     category,
//     vendor_id,
//     description,
//     amount,
//     paid_status,
//     payment_mode,
//     paid_now,
//     bank_account_id,
//     reference_no,
//     invoice_file_url,
//   ];
   
//   db.query(query, values, (err, result) => {
//     if(err){
//         console.log(err)
//         res.status(500).json({message: "Error in database query", error: err});

//     }
//     res.json(result)
//   })

// };

module.exports ={
    AddExpenses
}