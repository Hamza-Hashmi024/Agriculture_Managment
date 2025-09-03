const express = require("express");
const { createUser, getAllUsers, getMyProfile } = require("../Controller/userController");
const { verifyToken, requireAdmin } = require("../MiddleWare/auth");

const router = express.Router();

// Admin creates new user
router.post("/", verifyToken, requireAdmin, createUser);

// Admin gets all users
router.get("/", verifyToken, requireAdmin, getAllUsers);

// Any logged-in user gets own profile
router.get("/me", verifyToken, getMyProfile);

module.exports = router;