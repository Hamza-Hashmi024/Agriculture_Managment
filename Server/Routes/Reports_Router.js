const express = require("express");
const router = express.Router();
const asyncHandler = require('../MiddleWare/ErrorBoundry');
const {FarmerLedgerReports} = require('../Controller/Reports')

router.get('/reports/farmer/:id' , asyncHandler(FarmerLedgerReports));

module.exports = router;