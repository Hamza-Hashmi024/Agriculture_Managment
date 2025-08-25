const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const { GetAllCrops, addSaleLot , GetSalesList } = require("../Controller/Sales_Controller");

router.get("/crops",  asyncHandler(GetAllCrops));
router.post("/addSaleLot", asyncHandler(addSaleLot));
router.get("/list", asyncHandler(GetSalesList));

module.exports = router;
