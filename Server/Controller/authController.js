const db = require("../config/db");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../Utility/token");

const login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: "Error comparing password" });
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const { accessToken, refreshToken } = generateTokens(user);

      res.json({ accessToken, refreshToken });
    });
  });
};

module.exports = { login };