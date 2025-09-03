const db = require("../config/db");

// Default colors
const DEFAULTS = {
  primaryColor: "210 73% 42%",
  backgroundColor: "210 20% 98%",
  foregroundColor: "222 84% 4.9%",
};

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

    // Apply defaults if null
    const theme = {
      ...results[0],
      primaryColor: results[0].primaryColor ?? DEFAULTS.primaryColor,
      backgroundColor: results[0].backgroundColor ?? DEFAULTS.backgroundColor,
      foregroundColor: results[0].foregroundColor ?? DEFAULTS.foregroundColor,
    };

    res.json(theme);
  });
};

const saveTheme = (req, res) => {
  const { userId } = req.params;

  // Map frontend keys → DB keys
  const primaryColor = req.body.primaryColor || req.body.primary;
  const backgroundColor = req.body.backgroundColor || req.body.background;
  const foregroundColor = req.body.foregroundColor || req.body.foreground;

  db.query("SELECT * FROM themes WHERE userId = ?", [userId], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Error checking theme" });
    }

    if (results.length > 0) {
      // Update
      db.query(
        "UPDATE themes SET primaryColor=?, backgroundColor=?, foregroundColor=? WHERE userId=?",
        [primaryColor, backgroundColor, foregroundColor, userId],
        (err) => {
          if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ error: "Error updating theme" });
          }
          res.json({ message: "Theme updated successfully" });
        }
      );
    } else {
      // Insert
      db.query(
        "INSERT INTO themes (userId, primaryColor, backgroundColor, foregroundColor) VALUES (?, ?, ?, ?)",
        [userId, primaryColor, backgroundColor, foregroundColor],
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