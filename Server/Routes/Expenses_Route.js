const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const {AddExpenses , GetAllExpenses , EditExpense } = require('../Controller/Expenses_Controller')


router.post('/regiterexpense' ,  asyncHandler(AddExpenses) )
router.get('/' ,  asyncHandler(GetAllExpenses)  )
router.put('/editexpense/:id' , asyncHandler(EditExpense))
module.exports = router;
