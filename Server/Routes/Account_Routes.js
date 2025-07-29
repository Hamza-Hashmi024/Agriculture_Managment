const express = require("express");
const router = express.Router();
const {
  addBankAccount,
  createTransfer,
  getAccountsWithBalance,
} = require("../Controller/Account_Controller");

router.post("/create", addBankAccount);
router.post("/transfer", createTransfer);
router.get("/banks-with-balance", getAccountsWithBalance);

module.exports = router;
