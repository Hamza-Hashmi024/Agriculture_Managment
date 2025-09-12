const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  RegisterFarmer,
  GetAllFarmers,
  getFarmerByIdFull,
  GetAllFarmerPayable,
  AddFarmerPayments,
  FarmerPayableSummary,
} = require("../Controller/Farmer_Controller");
const { verifyToken, requireRole } = require("../MiddleWare/auth");

// ✅ Sirf Admin new farmer register kar sakta hai
router.post("/register", verifyToken, requireRole("admin"), asyncHandler(RegisterFarmer));

// ✅ Farmers list → admin + manager
router.get("/get", verifyToken, requireRole("admin", "manager"), asyncHandler(GetAllFarmers));

// ✅ Farmer full detail → admin + manager
router.get("/full/:id", verifyToken, requireRole("admin", "manager"), asyncHandler(getFarmerByIdFull));

// ✅ Net payable farmers → admin + manager
router.get("/netpayable", verifyToken, requireRole("admin", "manager"), asyncHandler(GetAllFarmerPayable));

// ✅ Add farmer payment → admin + manager
router.post("/addpayment", verifyToken, requireRole("admin", "manager"), asyncHandler(AddFarmerPayments));

// ✅ Farmer payable summary → admin + manager
router.get("/summary/:farmer_id", verifyToken, requireRole("admin", "manager"), asyncHandler(FarmerPayableSummary));

module.exports = router;
