const express = require("express");
const homeController = require("../controllers/homeController");
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');
const orderControlelr = require('../controllers/orderController');
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
router.get('/cart/remove/:id', cartController.removeItem);
router.delete('/cart/delete/:id', cartController.deleteItem);
router.post('/cart/update-user-info', cartController.updateUserInfo);

// Order
// router.use(authController.checkLogin);
router.post('/order/create', orderControlelr.createOrder);

//Comments
router.post('/comments/create', homeController.createComment);


module.exports = router;
