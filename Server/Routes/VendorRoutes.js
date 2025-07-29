const express = require("express");
const router = express.Router();
const {
  RegisterVendor,
  getVendor,
} = require("../Controller/Vendor_Controller");

router.post("/register", RegisterVendor);
router.get("/", getVendor);

module.exports = router;
