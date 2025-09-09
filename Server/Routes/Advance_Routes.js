const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createAdvance, GetAvanceList } = require("../Controller/Advance_Controller");
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const { verifyToken, requireRole } = require("../MiddleWare/auth");

const upload = multer();

router.post("/create", verifyToken, requireRole("admin"), upload.any(), asyncHandler(createAdvance));

router.get("/", verifyToken, requireRole("admin", "manager", "user"), asyncHandler(GetAvanceList));

module.exports = router;