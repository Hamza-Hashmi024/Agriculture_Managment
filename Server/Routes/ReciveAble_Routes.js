const express = require("express");
const router = express.Router();
const { getBuyerReceivables ,  AddPayment } = require("../Controller/Recivable_Controller");


router.get("/get", getBuyerReceivables);
router.post("/addPayment", AddPayment);

module.exports = router;