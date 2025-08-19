const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {DashboaredData} = require("../Controller/Dashboard");

router.get("/dashbored" ,  asyncHandler(DashboaredData));

module.exports = router;
