const crypto = require("crypto");
const db = require("../config/db");

function toMysqlDatetime(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

// Generate a secure random token
const generateResetToken = () => crypto.randomBytes(32).toString("hex");

// Save token in DB
const saveResetToken = (userId, token, expiresAt, cb) => {
  const expiresStr = toMysqlDatetime(expiresAt);
  const sql = "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)";
  db.query(sql, [userId, token, expiresStr], (err, result) => {
    if (err) return cb(err);
    cb(null, result.insertId);
  });
};

// Find token
const findToken = (token, cb) => {
  const sql = "SELECT * FROM password_reset_tokens WHERE token = ? LIMIT 1";
  db.query(sql, [token], (err, results) => {
    if (err) return cb(err);
    if (!results || results.length === 0) return cb(null, null);
    cb(null, results[0]);
  });
};

// Mark token as used
const markTokenUsed = (token, cb) => {
  const sql = "UPDATE password_reset_tokens SET used = TRUE WHERE token = ?";
  db.query(sql, [token], (err, result) => {
    if (err) return cb(err);
    cb(null, result.affectedRows);
  });
};

module.exports = { generateResetToken, saveResetToken, findToken, markTokenUsed };