const express = require("express");
const router = express.Router();
const {GetAllCheques ,  UpdateChequeStatus} = require("../Controller/CheckList_Controller");
const asyncHandler = require("../MiddleWare/ErrorBoundry");

router.get("/cheques", asyncHandler(GetAllCheques));
router.put("/cheques/status", asyncHandler(UpdateChequeStatus));

module.exports = router;
