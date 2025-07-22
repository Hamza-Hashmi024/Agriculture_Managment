const express = require('express');
const router = express.Router();
const { GetAllCrops , addSaleLot } = require("../Controller/Sales_Controller");

router.get("/crops", GetAllCrops);
router.post("/addSaleLot", addSaleLot );


module.exports = router;