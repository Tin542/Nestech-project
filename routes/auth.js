const express = require("express");
const authController = require('../controllers/authController');
const router = express.Router({});
const fileService = require("../services/fileService");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
})

router.get('/register', authController.register);

// upload hinh anh
// router.post("/products/upload-image", upload.single("file"), fileService.uploadFile);

module.exports = router;