const express = require("express");
const { getTheme, saveTheme } = require("../Controller/ThemeController");

const router = express.Router();

router.get("/:userId", getTheme);
router.put("/:userId", saveTheme);

module.exports = router;