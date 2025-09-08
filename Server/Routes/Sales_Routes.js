const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const { verifyToken, requireRole } = require("../MiddleWare/auth");

const { GetAllCrops, addSaleLot, GetSalesList } = require("../Controller/Sales_Controller");

// Crops → all authenticated users (admin, manager, user)
router.get("/crops", verifyToken, asyncHandler(GetAllCrops));

// Sales list → all authenticated users
router.get("/list", verifyToken, asyncHandler(GetSalesList));

// Add Sale Lot → admin + manager
router.post("/addSaleLot", verifyToken, requireRole("admin", "manager"), asyncHandler(addSaleLot));

module.exports = router;