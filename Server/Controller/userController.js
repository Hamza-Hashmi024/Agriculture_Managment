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
const getAllRoles = (req, res) => {
  const query = "SELECT id, name, description FROM roles";
  db.query(query, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(results);
  });
};

const assignUserRole = (req, res) => {
  const { userId, roleId } = req.body;
  if (!userId || !roleId) return res.status(400).json({ error: "userId & roleId required" });

  // Update role_id only
  const query = "UPDATE users SET role_id = ? WHERE id = ?";
  db.query(query, [roleId, userId], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "DB error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: `Role ID '${roleId}' assigned to user ${userId}` });
  });
};


module.exports = { createUser, getAllUsers, getMyProfile , assignUserRole, getAllRoles };