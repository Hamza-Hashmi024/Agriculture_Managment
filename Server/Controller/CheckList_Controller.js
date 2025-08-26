const db = require("../config/db")

const GetAllCheques = (req , res )=>{
    const query = `
    select * from  buyer_payment_checks;
    `
    db.query(query , (err , result ) =>{
        if (err){
            return res.status(500).json({ error: "Database query failed" });
        }
        res.status(200).json(result);
    })
}

module.exports = {GetAllCheques}