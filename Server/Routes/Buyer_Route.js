const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  registerBuyer,
  GetAllBuyers,
  GetAllBuyerBankAccounts,
  GetBuyerById,
  GetBuyerInstallments,
  getBuyersWithReceivables,
  GetAllBuyersWithRecivables,
  getBuyerDetails,
} = require("../Controller/Buyer_Controller");

router.post("/register", asyncHandler(registerBuyer));
router.get("/get", asyncHandler(GetAllBuyers));
router.get("/banks", asyncHandler(GetAllBuyerBankAccounts));
router.get("/:buyerId", asyncHandler(GetBuyerById));
router.get("/installments/:buyerId", asyncHandler(GetBuyerInstallments));
router.get("/getBuyers", asyncHandler(getBuyersWithReceivables));
router.get("/getBuyers/recivable", asyncHandler(GetAllBuyersWithRecivables));
router.get("/:id/details", asyncHandler(getBuyerDetails));

module.exports = router;
