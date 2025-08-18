const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  FarmerLedgerReports,
  BuyerLedgerReports,
  ReceivableAging,
  PayableAging,
  CashBook,
  BankBook,
  SalesReport,
} = require("../Controller/Reports");

router.get("/reports/farmer/:id", asyncHandler(FarmerLedgerReports));
router.get("/buyer/report/:id", asyncHandler(BuyerLedgerReports));
router.get("/salesReport", asyncHandler(SalesReport));
router.get("/receivable-aging", asyncHandler(ReceivableAging));
router.get("/payable-aging", asyncHandler(PayableAging));
router.get("/cashbook", asyncHandler(CashBook));
router.get("/bankbook", asyncHandler(BankBook));

module.exports = router;
