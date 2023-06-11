const express = require("express");
const homeController = require("../controllers/homeController");
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');
const router = express.Router({});

router.get("/", homeController.home);

// Products
router.get("/products", homeController.getList);
router.get("/products/detail/:id", homeController.getProductDetail);

// Cart

router.use(authController.checkLogin);
router.get("/cart", cartController.getCurrentCart);
router.get('/cart/current/:id', cartController.checkCart);
router.get('/cart/add/:id', cartController.addItem);


module.exports = router;
