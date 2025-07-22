const express = require("express");
const router = express.Router();
const { registerBuyer  ,  GetAllBuyers} = require("../Controller/Buyer_Controller");

router.post("/register", registerBuyer);
router.get("/get", GetAllBuyers);

module.exports = router;