const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); 
const { createAdvance } = require('../Controller/Advance_Controller')

router.post("/create"  , upload.any(), createAdvance);



module.exports = router;