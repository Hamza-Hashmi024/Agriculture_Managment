const express = require("express");
const {
  login,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
} = require("../Controller/authController");

const { verifyToken } = require("../MiddleWare/auth"); // middleware for protected routes

const router = express.Router();


// Login route
router.post("/login", login);

// Refresh token route
router.post("/refresh", refreshToken);

// Logout single refresh token
router.post("/logout", logout);

// Request password reset (forgot password)
router.post("/forgot", forgotPassword);

// Reset password using token
router.post("/reset", resetPassword);

// Logout all sessions for current user
router.post("/logout_all", verifyToken, logoutAll);

module.exports = router;