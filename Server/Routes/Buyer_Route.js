const express = require("express");
const router = express.Router();
const { registerBuyer } = require("../Controller/Buyer_Controller");

router.post("/buyers/register", registerBuyer);

module.exports = router;