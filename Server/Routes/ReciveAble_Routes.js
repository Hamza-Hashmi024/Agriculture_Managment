const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  getBuyerReceivables,
  AddPayment,
  getBuyerReceivableCard,
  getReceivablesDueOn,
  getReceivablesDueOnByBuyer,
  extendInstallmentDueDate,
} = require("../Controller/Recivable_Controller");

const { verifyToken, requireRole } = require("../MiddleWare/auth");

// ✅ Receivables list (Admin + Manager)
router.get("/get", verifyToken, requireRole("admin", "manager"), asyncHandler(getBuyerReceivables));

// ✅ Add payment (Admin + Manager)
router.post("/addPayment", verifyToken, requireRole("admin", "manager"), asyncHandler(AddPayment));

// ✅ Buyer receivable card (Admin + Manager)
router.get("/getCard/:buyerId", verifyToken, requireRole("admin", "manager"), asyncHandler(getBuyerReceivableCard));

// ✅ Receivables due today (Admin + Manager)
router.get("/due-today", verifyToken, requireRole("admin", "manager"), asyncHandler(getReceivablesDueOn));

// ✅ Receivables due today for a specific buyer (Admin + Manager)
router.get("/due-today/:buyerId", verifyToken, requireRole("admin", "manager"), asyncHandler(getReceivablesDueOnByBuyer));

// ✅ Extend installment due date (Admin only)
router.post("/extend-due-date/:installmentId", verifyToken, requireRole("admin"), asyncHandler(extendInstallmentDueDate));

module.exports = router;
