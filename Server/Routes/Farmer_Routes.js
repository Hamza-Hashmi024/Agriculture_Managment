const express = require("express");
const router = express.Router();
const {
  RegisterFarmer,
  GetAllFarmers,
} = require("../Controller/Farmer_Controller");

router.post("/register", RegisterFarmer);
router.get("/get", GetAllFarmers);

module.exports = router;
