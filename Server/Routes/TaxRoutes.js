const express = require("express");
const router = express.Router();
const { getAllTaxRules, createTaxRule, updateTaxRule, deleteTaxRule , getTaxRuleById } = require("../Controller/TaxController");
const asyncHandler = require("../MiddleWare/ErrorBoundry");
const { verifyToken, requireRole } = require("../MiddleWare/auth");


router.get("/", verifyToken, requireRole("admin", "manager", "user"), asyncHandler(getAllTaxRules));
router.post("/", verifyToken, requireRole("admin"), asyncHandler(createTaxRule));
router.put("/:id", verifyToken, requireRole("admin"), asyncHandler(updateTaxRule));
router.delete("/:id", verifyToken, requireRole("admin"), asyncHandler(deleteTaxRule));
router.get("/:id", verifyToken, requireRole("admin", "manager", "user"), asyncHandler(getTaxRuleById));

module.exports = router;