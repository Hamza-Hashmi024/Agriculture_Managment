const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  RegisterVendor,
  getVendor,
  GetVendorList
} = require("../Controller/Vendor_Controller");

router.post("/register", asyncHandler(RegisterVendor));
router.get("/", asyncHandler(getVendor));
router.get("/details" , asyncHandler(GetVendorList));

module.exports = router;
