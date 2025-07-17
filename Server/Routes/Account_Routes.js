const express = require("express");
const router = express.Router();
const addBankAccount = require("../Controller/Account_Controller");

router.post("/create", addBankAccount);

module.exports = router;