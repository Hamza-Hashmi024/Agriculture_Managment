const db = require("./config/db");
const bcrypt = require("bcrypt");

const email = "admin@example.com";
const name = "Super Admin";
const rawPassword = "Admin@123"; 

bcrypt.hash(rawPassword, 10, (err, hashed) => {
  if (err) {
    console.error("❌ Error hashing password:", err.message);
    process.exit(1);
  }

  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, hashed, "admin"], (err, result) => {
    if (err) {
      console.error(" Error creating admin:", err.message);
      process.exit(1);
    }
    console.log(" Admin created successfully!");
    process.exit(0);
  });
});

