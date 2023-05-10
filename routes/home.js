const express = require("express");
const homeController = require("../controllers/homeController");
const productController = require("../controllers/productCotroller");
const router = express.Router({});

router.get('/', homeController.home);

router.get('/products', productController.getList);
router.post('/products/add', productController.addProduct);

module.exports = router;