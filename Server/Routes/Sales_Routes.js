const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const { GetAllCrops, addSaleLot } = require("../Controller/Sales_Controller");

router.get("/crops",  asyncHandler(GetAllCrops));
router.post("/addSaleLot", asyncHandler(addSaleLot));

module.exports = router;
