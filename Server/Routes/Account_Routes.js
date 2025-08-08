const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  addBankAccount,
  createTransfer,
  getAccountsWithBalance,
} = require("../Controller/Account_Controller");

router.post("/create", asyncHandler(addBankAccount));
router.post("/transfer", asyncHandler(createTransfer));
router.get("/banks-with-balance", asyncHandler(getAccountsWithBalance));

module.exports = router;
