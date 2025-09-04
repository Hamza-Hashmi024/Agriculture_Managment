const db = require("../config/db");
const bcrypt = require("bcrypt");

// ✅ Admin creates new user
const createUser = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: "Password hashing failed" });

    const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "DB error" });
      }

      res.status(201).json({ message: "User created successfully", userId: result.insertId });
    });
  });
};


const getAllUsers = (req, res) => {
  db.query("SELECT id, name, email, role, created_at FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results);
  });
};

// ✅ Get own profile
const getMyProfile = (req, res) => {
  db.query("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results[0]);
  });
};



const assignUserRole = (req, res) => {
  const { userId, role } = req.body;
  if (!userId || !role) return res.status(400).json({ error: "userId & role required" });

  assignRole(userId, role, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Role '${role}' assigned to user ${userId}` });
  });
};


module.exports = { createUser, getAllUsers, getMyProfile , assignUserRole };