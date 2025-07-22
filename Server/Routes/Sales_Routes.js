const express = require('express');
const router = express.Router();
const { GetAllCrops } = require("../Controller/Sales_Controller");

router.get("/crops", GetAllCrops);


module.exports = router;