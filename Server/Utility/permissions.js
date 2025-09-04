const db = require("../config/db");

// Get all permissions of a user based on role
const getUserPermissions = (userId, cb) => {
  const sql = `
    SELECT p.name FROM permissions p
    JOIN role_permissions rp ON rp.permission_id = p.id
    JOIN users u ON u.role_id = rp.role_id
    WHERE u.id = ?`;
  db.query(sql, [userId], (err, results) => {
    if (err) return cb(err);
    const permissions = results.map(r => r.name);
    cb(null, permissions);
  });
};

// Assign role to user
const assignRole = (userId, roleName, cb) => {
  db.query("SELECT id FROM roles WHERE name = ?", [roleName], (err, rows) => {
    if (err) return cb(err);
    if (!rows.length) return cb(new Error("Role not found"));
    const roleId = rows[0].id;
    db.query("UPDATE users SET role_id = ? WHERE id = ?", [roleId, userId], cb);
  });
};

module.exports = { getUserPermissions, assignRole };