const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  RegisterVendor,
  getVendor,
  GetVendorList,
  VendorProfile,
  AddPaymentVendor
} = require("../Controller/Vendor_Controller");
const { verifyToken, requireRole } = require("../MiddleWare/auth");

// Admin + Manager can register vendor
router.post("/register", verifyToken, requireRole("admin", "manager"), asyncHandler(RegisterVendor));

//  Admin + Manager + User → Can view vendors
router.get("/", verifyToken, requireRole("admin", "manager", "user"), asyncHandler(getVendor));
router.get("/details", verifyToken, requireRole("admin", "manager", "user"), asyncHandler(GetVendorList));
router.get("/profile/:id", verifyToken, requireRole("admin", "manager", "user"), asyncHandler(VendorProfile));

//  Admin + Manager can add vendor payments
router.post("/addpayment", verifyToken, requireRole("admin", "manager"), asyncHandler(AddPaymentVendor));

module.exports = router;