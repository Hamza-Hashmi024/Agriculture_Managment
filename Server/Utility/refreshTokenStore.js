const db = require("../config/db");


function toMysqlDatetime(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

const saveRefreshToken = (token, userId, expiresAt, cb) => {
  const expiresAtStr = toMysqlDatetime(expiresAt);
  const sql = "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)";
  db.query(sql, [userId, token, expiresAtStr], (err, result) => {
    if (err) return cb(err);
    cb(null, result.insertId);
  });
};

const findRefreshToken = (token, cb) => {
  const sql = "SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1";
  db.query(sql, [token], (err, results) => {
    if (err) return cb(err);
    if (!results || results.length === 0) return cb(null, null);
    cb(null, results[0]);
  });
};

const revokeRefreshToken = (token, cb) => {
  const sql = "UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = ?";
  db.query(sql, [token], (err, result) => {
    if (err) return cb(err);
    cb(null, result.affectedRows);
  });
};

const revokeAllTokensForUser = (userId, cb) => {
  const sql = "UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return cb(err);
    cb(null, result.affectedRows);
  });
};

module.exports = {
  saveRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllTokensForUser,
};