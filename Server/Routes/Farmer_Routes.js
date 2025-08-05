const express = require("express");
const router = express.Router();
const {
  RegisterFarmer,
  GetAllFarmers,
 getFarmerByIdFull
} = require("../Controller/Farmer_Controller");

router.post("/register", RegisterFarmer);
router.get("/get", GetAllFarmers);
router.get("/full/:id", getFarmerByIdFull);

module.exports = router;
