const express = require("express");
const router = express.Router();
const {GetAllCheques} = require("../Controller/CheckList_Controller");
const asyncHandler = require("../MiddleWare/ErrorBoundry");

router.get("/cheques", asyncHandler(GetAllCheques));

module.exports = router;
