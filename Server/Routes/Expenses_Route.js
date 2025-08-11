const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {AddExpenses , GetAllExpenses  } = require('../Controller/Expenses_Controller')


router.post('/regiterexpense' ,  asyncHandler(AddExpenses) )
router.get('/' ,  asyncHandler(GetAllExpenses)  )
module.exports = router;
