const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const { verifyToken, requireRole } = require("../MiddleWare/auth");

const {
  FarmerLedgerReports,
  BuyerLedgerReports,
  ReceivableAging,
  PayableAging,
  CashBook,
  BankBook,
  SalesReport,
} = require("../Controller/Reports");

// Admin only reports
router.get("/reports/farmer/:id", verifyToken, requireRole("admin"), asyncHandler(FarmerLedgerReports));
router.get("/buyer/report/:id", verifyToken, requireRole("admin"), asyncHandler(BuyerLedgerReports));

// Admin + Manager reports
router.get("/salesReport", verifyToken, requireRole("admin", "manager"), asyncHandler(SalesReport));
router.get("/receivable-aging", verifyToken, requireRole("admin", "manager"), asyncHandler(ReceivableAging));
router.get("/payable-aging", verifyToken, requireRole("admin", "manager"), asyncHandler(PayableAging));
router.get("/cashbook", verifyToken, requireRole("admin", "manager"), asyncHandler(CashBook));
router.get("/bankbook", verifyToken, requireRole("admin", "manager"), asyncHandler(BankBook));

module.exports = router;