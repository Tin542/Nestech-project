const express = require("express");
const homeController = require("../controllers/homeController");
const productController = require("../controllers/productCotroller");
const fileService = require("../services/fileService");
const multer = require("multer");
const router = express.Router({});

const upload = multer({
    storage: multer.memoryStorage(),
})

router.get('/', homeController.home);

router.get('/products', productController.getList);
router.get('/products/detail/:id', homeController.getProductDetail);

// upload hinh anh
router.post("/products/upload-image", upload.single("file"), fileService.uploadFile);

module.exports = router;