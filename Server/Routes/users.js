const express = require("express");
const { 
  createUser, 
  getAllUsers, 
  getMyProfile, 
  assignUserRole,
  getAllRoles
} = require("../Controller/userController");

const { verifyToken, requireRole } = require("../MiddleWare/auth");

const router = express.Router();

// ✅ Only Admin can create new user
router.post("/", verifyToken, requireRole("admin"), createUser);

// ✅ Only Admin can get all users
router.get("/", verifyToken, requireRole("admin"), getAllUsers);

// ✅ Any logged-in user can get their own profile
router.get("/me", verifyToken, getMyProfile);

// ✅ Only Admin can assign roles
router.post("/assign-role", verifyToken, requireRole("admin"), assignUserRole);

// ✅ Only Admin can see all roles
router.get("/roles", verifyToken, requireRole("admin"), getAllRoles);

module.exports = router;
