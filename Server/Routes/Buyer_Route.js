const express = require("express");
const router = express.Router();
const {
  registerBuyer,
  GetAllBuyers,
  GetAllBuyerBankAccounts,
  GetBuyerById,
  GetBuyerInstallments,
  getBuyersWithReceivables,
  GetAllBuyersWithRecivables 
} = require("../Controller/Buyer_Controller");

router.post("/register", registerBuyer);
router.get("/get", GetAllBuyers);
router.get("/banks", GetAllBuyerBankAccounts);
router.get("/:buyerId", GetBuyerById);
router.get("/installments/:buyerId", GetBuyerInstallments);
router.get("/getBuyers", getBuyersWithReceivables);
router.get("/getBuyers/recivable", GetAllBuyersWithRecivables );

module.exports = router;
