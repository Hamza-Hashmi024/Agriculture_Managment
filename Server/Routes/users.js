const express = require("express");
const { 
  createUser, 
  getAllUsers, 
  getMyProfile, 
  assignUserRole 
} = require("../Controller/userController");

const { verifyToken, requireAdmin } = require("../MiddleWare/auth");
const { requirePermission } = require("../MiddleWare/permission");

const router = express.Router();

//  Admin creates a new user (requires create_user permission)
router.post("/", verifyToken, requirePermission("create_user"), createUser);

// Admin gets all users (requires view_reports permission)
router.get("/", verifyToken, requirePermission("view_reports"), getAllUsers);

// Any logged-in user gets own profile
router.get("/me", verifyToken, getMyProfile);

// Admin assigns role to a user
router.post("/assign-role", verifyToken, requireAdmin, assignUserRole);

module.exports = router;