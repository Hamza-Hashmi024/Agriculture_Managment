const express = require("express");
const router = express.Router();
const {
  RegisterFarmer,
  GetAllFarmers,
 getFarmerByIdFull,
 GetAllFarmerPayable
} = require("../Controller/Farmer_Controller");


router.post("/register", RegisterFarmer);
router.get("/get", GetAllFarmers);
router.get("/full/:id", getFarmerByIdFull);
router.get("/netpayable", GetAllFarmerPayable);

module.exports = router;
