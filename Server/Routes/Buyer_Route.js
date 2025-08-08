const express = require("express");
const router = express.Router();

const {
  registerBuyer,
  GetAllBuyers,
  GetAllBuyerBankAccounts,
  GetBuyerById,
  GetBuyerInstallments,
  getBuyersWithReceivables,
  GetAllBuyersWithRecivables ,
  getBuyerDetails
} = require("../Controller/Buyer_Controller");


router.post("/register", registerBuyer);
router.get("/get", GetAllBuyers);
router.get("/banks", GetAllBuyerBankAccounts);
router.get("/:buyerId", GetBuyerById);
router.get("/installments/:buyerId", GetBuyerInstallments);
router.get("/getBuyers", getBuyersWithReceivables);
router.get("/getBuyers/recivable", GetAllBuyersWithRecivables );
router.get('/:id/details', getBuyerDetails);



module.exports = router;
