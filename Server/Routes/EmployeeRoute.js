const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const asyncHandler = require("../MiddleWare/ErrorBoundry");
const { verifyToken, requireRole } = require("../MiddleWare/auth");
const { createEmployee } = require("../Controller/EmployeeController");

// Ensure files go into public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//  accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post(
  "/create",
  verifyToken,
  requireRole("admin"),
  upload.single("profilePhoto"),
  asyncHandler(createEmployee)
);

module.exports = router;