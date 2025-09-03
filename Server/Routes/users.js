const express = require("express");
const router = express.Router();

// temporary test route
router.get("/", (req, res) => {
  res.json({ message: "Users route working!" });
});

module.exports = router;