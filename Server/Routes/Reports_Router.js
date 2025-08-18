const express = require("express");
const router = express.Router();
const asyncHandler = require('../MiddleWare/ErrorBoundry');
const {FarmerLedgerReports ,  BuyerLedgerReports ,
    ReceivableAging , PayableAging , CashBook ,  BankBook
 } = require('../Controller/Reports')

router.get('/reports/farmer/:id' , asyncHandler(FarmerLedgerReports));
router.get('/buyer/report/:id' ,  asyncHandler(BuyerLedgerReports));

router.get("/receivable-aging", ReceivableAging);

// Payable Aging
router.get("/payable-aging", PayableAging);

// Cashbook (requires ?from=YYYY-MM-DD&to=YYYY-MM-DD)
router.get("/cashbook", CashBook);

// Bankbook (requires ?from=YYYY-MM-DD&to=YYYY-MM-DD)
router.get("/bankbook", BankBook);

module.exports = router;