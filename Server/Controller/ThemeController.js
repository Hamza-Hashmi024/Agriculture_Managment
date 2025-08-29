const db = require("../config/db");

// ✅ GET Theme
const getTheme = (req, res) => {
  const { userId } = req.params;

  db.query("SELECT * FROM themes WHERE userId = ?", [userId], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Error fetching theme" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Theme not found" });
    }

    res.json(results[0]);
  });
};

// ✅ SAVE / UPDATE Theme
const saveTheme = (req, res) => {
  const { userId } = req.params;
  const { primary, background, foreground } = req.body;

  db.query("SELECT * FROM themes WHERE userId = ?", [userId], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Error checking theme" });
    }

    if (results.length > 0) {
      // Update theme
      db.query(
        "UPDATE themes SET primary=?, background=?, foreground=? WHERE userId=?",
        [primary, background, foreground, userId],
        (err) => {
          if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "Error updating theme" });
          }
          res.json({ message: "Theme updated successfully" });
        }
      );
    } else {
      // Insert new theme
      db.query(
        "INSERT INTO themes (userId, primary, background, foreground) VALUES (?, ?, ?, ?)",
        [userId, primary, background, foreground],
        (err) => {
          if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "Error inserting theme" });
          }
          res.json({ message: "Theme saved successfully" });
        }
      );
    }
  });
};

module.exports = {
  getTheme,
  saveTheme,
};