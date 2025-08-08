const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  getBuyerReceivables,
  AddPayment,
  getBuyerReceivableCard,
} = require("../Controller/Recivable_Controller");

router.get("/get", asyncHandler(getBuyerReceivables));
router.post("/addPayment", asyncHandler(AddPayment));
router.get("/getCard/:buyerId", asyncHandler(getBuyerReceivableCard));

module.exports = router;
