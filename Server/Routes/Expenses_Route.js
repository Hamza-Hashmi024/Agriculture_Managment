const express = require("express");
const router = express.Router();
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const { AddExpenses, GetAllExpenses, EditExpense } = require("../Controller/Expenses_Controller");
const { verifyToken, requireRole } = require("../MiddleWare/auth");

//  Expense register → sirf admin aur manager
router.post("/register", verifyToken, requireRole("admin", "manager"), asyncHandler(AddExpenses));

//  Expense list → admin + manager dono dekh sakte hain
router.get("/", verifyToken, requireRole("admin", "manager"), asyncHandler(GetAllExpenses));

//  Expense edit → sirf admin
router.put("/edit/:id", verifyToken, requireRole("admin"), asyncHandler(EditExpense));

module.exports = router;
