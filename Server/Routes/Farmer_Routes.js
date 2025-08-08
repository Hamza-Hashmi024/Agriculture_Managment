const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {
  RegisterFarmer,
  GetAllFarmers,
 getFarmerByIdFull,
 GetAllFarmerPayable,
 AddFarmerPayments,
 FarmerPayableSummary
} = require("../Controller/Farmer_Controller");


router.post("/register", asyncHandler(RegisterFarmer));
router.get("/get",  asyncHandler(GetAllFarmers));
router.get("/full/:id", asyncHandler(getFarmerByIdFull));
router.get("/netpayable",   asyncHandler(GetAllFarmerPayable));
router.post("/addpayment", asyncHandler(AddFarmerPayments) );
router.get("/summary/:farmer_id", asyncHandler(FarmerPayableSummary));

module.exports = router;
