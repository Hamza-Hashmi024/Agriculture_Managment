const express = require("express");
const router = express.Router();
const { registerBuyer  ,  GetAllBuyers,
     GetAllBuyerBankAccounts , GetBuyerById , GetBuyerInstallments} = require("../Controller/Buyer_Controller");

router.post("/register", registerBuyer);
router.get("/get", GetAllBuyers);
router.get("/banks", GetAllBuyerBankAccounts);
router.get("/:buyerId", GetBuyerById);
router.get("/installments/:buyerId", GetBuyerInstallments);

module.exports = router;



