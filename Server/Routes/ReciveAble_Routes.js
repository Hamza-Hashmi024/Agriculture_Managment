const express = require("express");
const router = express.Router();
const {
  getBuyerReceivables,
  AddPayment,
  getBuyerReceivableCard
} = require("../Controller/Recivable_Controller");

router.get("/get", getBuyerReceivables);
router.post("/addPayment", AddPayment);
router.get("/getCard/:buyerId", getBuyerReceivableCard);

module.exports = router;
