const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createAdvance } = require("../Controller/Advance_Controller");
const asyncHandler = require("../MiddleWare/ErrorBoundry");

const upload = multer();

router.post("/create", upload.any(), asyncHandler(createAdvance));

module.exports = router;
