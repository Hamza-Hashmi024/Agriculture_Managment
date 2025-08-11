const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {AddExpenses} = require('../Controller/Expenses_Controller')


router.post('/regiterexpense' ,  AddExpenses )

module.exports = router;
