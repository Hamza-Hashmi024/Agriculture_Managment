const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createAdvance } = require("../Controller/Advance_Controller");


const upload = multer();


router.post("/create", upload.any(), createAdvance);

module.exports = router;