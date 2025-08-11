const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  RegisterVendor,
  getVendor,
  GetVendorList,
  VendorProfile
} = require("../Controller/Vendor_Controller");

router.post("/register", asyncHandler(RegisterVendor));
router.get("/", asyncHandler(getVendor));
router.get("/details" , asyncHandler(GetVendorList));
router.get("/profile/:id" , VendorProfile);

module.exports = router;
