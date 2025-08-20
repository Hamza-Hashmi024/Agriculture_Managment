const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createAdvance  , GetAvanceList} = require("../Controller/Advance_Controller");
const asyncHandler = require("../MiddleWare/ErrorBoundry");

const upload = multer();

router.post("/create", upload.any(), asyncHandler(createAdvance));
router.get("/"  , asyncHandler(GetAvanceList));

module.exports = router;
