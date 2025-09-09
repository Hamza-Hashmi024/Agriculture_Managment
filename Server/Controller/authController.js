const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateTokens } = require("../Utility/token");
const refreshStore = require("../Utility/refreshTokenStore");
const {
  generateResetToken,
  saveResetToken,
  findToken,
  markTokenUsed
} = require("../Utility/passwordResetToken");
const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail SMTP server
  port: 465,              // or 587
  secure: true,           // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//  LOGIN 
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Email & password required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (!results || results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: "Error comparing password" });
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const { accessToken, refreshToken } = generateTokens(user);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      refreshStore.saveRefreshToken(refreshToken, user.id, expiresAt, (saveErr) => {
        if (saveErr) {
          console.error("Error saving refresh token:", saveErr);
          return res.status(500).json({ error: "Failed to save refresh token" });
        }

        res.json({ accessToken, refreshToken });
      });
    });
  });
};

// REFRESH TOKEN 
const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: "Invalid or expired refresh token" });

    refreshStore.findRefreshToken(refreshToken, (findErr, row) => {
      if (findErr) return res.status(500).json({ error: "DB error" });
      if (!row) return res.status(403).json({ error: "Refresh token not found" });
      if (row.is_revoked) return res.status(403).json({ error: "Refresh token revoked" });

      const now = new Date();
      const expiresAt = new Date(row.expires_at);
      if (expiresAt <= now) return res.status(403).json({ error: "Refresh token expired" });

      db.query("SELECT id, role FROM users WHERE id = ?", [row.user_id], (uErr, users) => {
        if (uErr) return res.status(500).json({ error: "DB error" });
        if (!users || users.length === 0) return res.status(404).json({ error: "User not found" });

        const user = users[0];
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user);

        refreshStore.revokeRefreshToken(refreshToken, (revokeErr) => {
          if (revokeErr) console.error("Warning: could not revoke old refresh token:", revokeErr);

          const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          refreshStore.saveRefreshToken(newRefreshToken, user.id, newExpiresAt, (saveErr) => {
            if (saveErr) return res.status(500).json({ error: "Failed to save new refresh token" });

            res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
          });
        });
      });
    });
  });
};

//LOGOUT SINGLE
const logout = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

  refreshStore.revokeRefreshToken(refreshToken, (err) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json({ message: "Logged out (refresh token revoked)" });
  });
};


const logoutAll = (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  refreshStore.revokeAllTokensForUser(userId, (err) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json({ message: "All refresh tokens revoked for user" });
  });
};




const forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  db.query("SELECT id FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (!results || results.length === 0)
      return res.status(404).json({ error: "User not found" });

    const userId = results[0].id;
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min expiry

    saveResetToken(userId, token, expiresAt, async (saveErr) => {
      if (saveErr)
        return res.status(500).json({ error: "Failed to generate reset token" });


      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      console.log("FRONTEND_URL =>", process.env.FRONTEND_URL);


      try {
        await transporter.sendMail({
          from: `"Support" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Password Reset Request",
          html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" target="_blank">${resetUrl}</a>
            <p>This link will expire in 30 minutes.</p>
          `,
        });

        res.json({ message: "Password reset link sent to your email" });
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
        res.status(500).json({ error: "Failed to send email" });
      }
    });
  });
};


const resetPassword = (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) 
    return res
      .status(400)
      .json({ error: "Token and new password required" });

  findToken(token, (err, row) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (!row) return res.status(404).json({ error: "Invalid token" });
    if (row.used) return res.status(403).json({ error: "Token already used" });

    const now = new Date();
    if (new Date(row.expires_at) <= now)
      return res.status(403).json({ error: "Token expired" });

    // Hash new password
    bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
      if (hashErr)
        return res.status(500).json({ error: "Error hashing password" });

      // Update user password
      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, row.user_id],
        (updateErr) => {
          if (updateErr)
            return res
              .status(500)
              .json({ error: "Failed to update password" });

          // Mark token as used
          markTokenUsed(token, (markErr) => {
            if (markErr)
              console.error("Warning: failed to mark token used", markErr);
            res.json({ message: "Password changed successfully" });
          });
        }
      );
    });
  });
};




module.exports = {
  login,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword
};