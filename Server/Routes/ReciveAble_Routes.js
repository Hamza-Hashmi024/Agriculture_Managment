const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  getBuyerReceivables,
  AddPayment,
  getBuyerReceivableCard,
  getReceivablesDueOn,
  getReceivablesDueOnByBuyer,
  extendInstallmentDueDate
} = require("../Controller/Recivable_Controller");

router.get("/get", asyncHandler(getBuyerReceivables));
router.post("/addPayment", asyncHandler(AddPayment));
router.get("/getCard/:buyerId", asyncHandler(getBuyerReceivableCard));
router.get("/due-today", getReceivablesDueOn);
router.get("/due-today/:buyerId", getReceivablesDueOnByBuyer);
router.post("/extend-due-date/:installmentId", extendInstallmentDueDate);

module.exports = router;
