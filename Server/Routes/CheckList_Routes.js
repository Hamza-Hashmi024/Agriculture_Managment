const express = require("express");
const router = express.Router();
const { GetAllCheques, UpdateChequeStatus } = require("../Controller/CheckList_Controller");
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const { verifyToken, requireRole } = require("../MiddleWare/auth");

// Cheques list dekhna → admin, manager, user
router.get("/cheques", verifyToken, requireRole("admin", "manager", "user"), asyncHandler(GetAllCheques));

// Cheque status update karna → sirf admin, manager
router.put("/cheques/status", verifyToken, requireRole("admin", "manager"), asyncHandler(UpdateChequeStatus));

module.exports = router;