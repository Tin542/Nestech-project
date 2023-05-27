const express = require("express");
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const router = express.Router({});
const fileService = require("../services/fileService");
const multer = require("multer");


const upload = multer({
    storage: multer.memoryStorage(),
})

router.use(authController.checkLogin);
// product
router.get('/products/list', adminController.getList);
router.post('/products/add', adminController.addProduct);
router.get('/products/detail/:id', adminController.getProductDetail);
router.post('/products/edit', adminController.editProduct);
router.delete('/products/delete/:id', adminController.deleteProduct);

// user
router.get('/user/list', adminController.users);

// upload hinh anh
router.post("/products/upload-image", upload.single("file"), fileService.uploadFile);

module.exports = router;