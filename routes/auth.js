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

// Controllers Routes
router.post("/register", authController.register);
router.post("/verify", authController.verify);
router.post('/login', authController.login);


// upload hinh anh
// router.post("/products/upload-image", upload.single("file"), fileService.uploadFile);

module.exports = router;
