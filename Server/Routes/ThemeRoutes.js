const express = require("express");
const { getTheme, saveTheme } = require("../Controller/ThemeController");
const { verifyToken } = require("../MiddleWare/auth");

const router = express.Router();

// ✅ Any logged-in user can get their theme
router.get("/:userId", verifyToken, getTheme);

// ✅ Only same user OR admin can update theme
router.put("/:userId", verifyToken, (req, res, next) => {
  const isAdmin = req.user.role === "admin";
  const isSelf = req.user.id == req.params.userId;

  if (isAdmin || isSelf) {
    return saveTheme(req, res, next);
  }

  return res.status(403).json({ error: "Not authorized" });
});

module.exports = router;