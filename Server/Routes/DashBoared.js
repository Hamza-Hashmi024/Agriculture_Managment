const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const { DashboaredData } = require("../Controller/Dashboard");
const { verifyToken, requireRole } = require("../MiddleWare/auth");

// Dashboard data → admin + manager dono dekh sakte hain
router.get("/dashboard", verifyToken, requireRole("admin", "manager"), asyncHandler(DashboaredData));

module.exports = router;