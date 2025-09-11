const db = require("../config/db"); 

// GET /tax-rules
const getAllTaxRules = (req, res) => {
  const sql = "SELECT * FROM tax_rules ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching tax rules:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// POST /tax-rules
const createTaxRule = (req, res) => {
  const { name, type, value, effective_from, notes } = req.body;

  if (!name || !type || !value) {
    return res.status(400).json({ error: "Name, type and value are required" });
  }

  const sql = "INSERT INTO tax_rules (name, type, value, effective_from, notes) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, type, value, effective_from || null, notes || null], (err, result) => {
    if (err) {
      console.error("Error inserting tax rule:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ id: result.insertId, name, type, value, effective_from, notes });
  });
};

// PUT /tax-rules/:id
const  updateTaxRule = (req, res) => {
  const { id } = req.params;
  const { name, type, value, effective_from, notes } = req.body;

  const sql = "UPDATE tax_rules SET name = ?, type = ?, value = ?, effective_from = ?, notes = ? WHERE id = ?";
  db.query(sql, [name, type, value, effective_from || null, notes || null, id], (err, result) => {
    if (err) {
      console.error("Error updating tax rule:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tax rule not found" });
    }
    res.json({ message: "Tax rule updated successfully" });
  });
};

// DELETE /tax-rules/:id
 const deleteTaxRule = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tax_rules WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting tax rule:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tax rule not found" });
    }
    res.json({ message: "Tax rule deleted successfully" });
  });
};

module.exports = {
  getAllTaxRules,
  createTaxRule,
    updateTaxRule,
    deleteTaxRule,
};