const express = require("express");
const router = express.Router();
const asyncHandler = require('../MiddleWare/ErrorBoundry');
const {FarmerLedgerReports ,  BuyerLedgerReports } = require('../Controller/Reports')

router.get('/reports/farmer/:id' , asyncHandler(FarmerLedgerReports));
router.get('/buyer/report/:id' ,  asyncHandler(BuyerLedgerReports));

module.exports = router;