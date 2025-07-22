const express = require("express");
const router = express.Router();
const { registerBuyer  ,  GetAllBuyers, GetAllBuyerBankAccounts} = require("../Controller/Buyer_Controller");

router.post("/register", registerBuyer);
router.get("/get", GetAllBuyers);
router.get("/banks", GetAllBuyerBankAccounts);

module.exports = router;