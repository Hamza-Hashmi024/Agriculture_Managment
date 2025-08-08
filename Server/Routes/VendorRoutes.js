const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  RegisterVendor,
  getVendor,
} = require("../Controller/Vendor_Controller");

router.post("/register", asyncHandler(RegisterVendor));
router.get("/", asyncHandler(getVendor));

module.exports = router;
