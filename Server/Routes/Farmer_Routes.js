const express = require('express');
const router = express.Router();
const {RegisterFarmer } = require("../Controller/Farmer_Controller");

router.post("/register" ,  RegisterFarmer);


module.exports = router;