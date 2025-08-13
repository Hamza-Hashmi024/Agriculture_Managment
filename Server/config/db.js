const mysql2 = require("mysql2");
require("dotenv").config();

let db;

try {
  db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  db.connect((err) => {
    if (err) {
      console.error(" Error connecting to the database:", err.message);
     
    } else {
      console.log(" Connected to the database successfully");
    }
  });

  
  db.on("error", (err) => {
    console.error(" Database error:", err.message);
    
  });

} catch (err) {
  console.error(" Synchronous DB setup error:", err.message);
}

module.exports = db;


