const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router({});
const fileService = require("../services/fileService");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

// render UI
router.get("/register", (req, res) => {
  res.render("pages/auth/register.ejs");
});
router.get("/verifyEmail", (req, res) => {
  res.render("pages/auth/verifyEmail.ejs");
});
router.get("/login", (req, res) => {
  res.render("pages/auth/login.ejs");
});
router.get("/reset", (req, res) => {
  res.render("pages/auth/resetPassword.ejs", { isDisabled: true });
});
router.get("/verify-email", (req, res) => {
  res.render("pages/auth/verifyEmailForReset.ejs", { s: "" });
});

// Controllers Routes
router.post("/register", authController.register);
router.post("/verify", authController.verify);
router.post("/login", authController.login);
router.post("/reset", authController.reset);
router.post("/sendOTP", authController.sendOTP);

// upload hinh anh
// router.post("/products/upload-image", upload.single("file"), fileService.uploadFile);

module.exports = router;
