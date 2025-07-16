const express = require('express');
const router = express.Router();
const { RegisterVendor} = require("../Controller/Vendor_Controller");

router.post("/register/vendor" , RegisterVendor);


module.exports = router;