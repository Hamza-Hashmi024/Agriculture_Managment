const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  getAccountsSummary,
  addBankAccount,
  createTransfer,
  getAccountsWithBalance,
  getAllCashBoxTransaction,
  GetAllBankAccountsTransaction
} = require("../Controller/Account_Controller");

router.post("/create", asyncHandler(addBankAccount));
router.post("/transfer", asyncHandler(createTransfer));
router.get("/banks-with-balance", asyncHandler(getAccountsWithBalance));
router.get('/cash/transaction' ,  asyncHandler(getAllCashBoxTransaction));
router.get('/GetAllBankAccountsTransaction' , asyncHandler(GetAllBankAccountsTransaction));
router.get('/summary', asyncHandler(getAccountsSummary));

module.exports = router;
