const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const { verifyToken, requireRole } = require("../MiddleWare/auth");

const {
  getAccountsSummary,
  addBankAccount,
  createTransfer,
  getAccountsWithBalance,
  getAllCashBoxTransaction,
  GetAllBankAccountsTransaction
} = require("../Controller/Account_Controller");

// Bank account create → only Admin
router.post("/create", verifyToken, requireRole("admin"), asyncHandler(addBankAccount));

//  Transfer → only Admin
router.post("/transfer", verifyToken, requireRole("admin"), asyncHandler(createTransfer));

//  Accounts with balance → Admin + Manager + User (sab dekh sakte hain)
router.get("/banks-with-balance", verifyToken, requireRole("admin", "manager", "user"), asyncHandler(getAccountsWithBalance));

//  Cashbox transactions → Admin + Manager (accountant ka kaam bhi hai)
router.get("/cash/transaction", verifyToken, requireRole("admin", "manager"), asyncHandler(getAllCashBoxTransaction));

//  Bank transactions → Admin + Manager
router.get("/GetAllBankAccountsTransaction", verifyToken, requireRole("admin", "manager"), asyncHandler(GetAllBankAccountsTransaction));

//  Summary → Admin + Manager + User (sabko summary dikh sakti hai)
router.get("/summary", verifyToken, requireRole("admin", "manager", "user"), asyncHandler(getAccountsSummary));

module.exports = router;