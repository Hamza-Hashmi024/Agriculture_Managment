const db = require("../config/db");



const GetAllCrops = (req , res ) =>{
    db.query("SELECT * FROM crops" , (err , results) => {
        if (err){
            console.log(err);
            res.status(500).json({ error: "Internal Server Error" });

        }else{
            res.status(200).json(results);
        }

    })
}

module.exports = {
    GetAllCrops
}