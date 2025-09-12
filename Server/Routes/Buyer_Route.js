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
const { verifyToken, requireRole } = require("../MiddleWare/auth");

// Sirf admin naye buyers register kar sakta hai
router.post("/register", verifyToken, requireRole("admin"), asyncHandler(registerBuyer));

// Buyers list → admin, manager, user
router.get("/get", verifyToken, requireRole("admin", "manager", "user"), asyncHandler(GetAllBuyers));

// Buyers ke bank accounts → admin, manager
router.get("/banks", verifyToken, requireRole("admin", "manager"), asyncHandler(GetAllBuyerBankAccounts));

// Specific buyer detail → admin, manager
router.get("/:buyerId", verifyToken, requireRole("admin", "manager"), asyncHandler(GetBuyerById));

// Installments → admin, manager, user
router.get("/installments/:buyerId", verifyToken, requireRole("admin", "manager", "user"), asyncHandler(GetBuyerInstallments));

// Buyers with receivables → admin, manager
router.get("/getBuyers", verifyToken, requireRole("admin", "manager"), asyncHandler(getBuyersWithReceivables));

// All buyers with receivables → sirf admin
router.get("/getBuyers/recivable", verifyToken, requireRole("admin"), asyncHandler(GetAllBuyersWithRecivables));

// Buyer details → admin, manager
router.get("/:id/details", verifyToken, requireRole("admin", "manager"), asyncHandler(getBuyerDetails));

module.exports = router;