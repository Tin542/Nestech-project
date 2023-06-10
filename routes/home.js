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
router.get("/cart", (req, res) => {
  res.render("pages/cart.ejs");
});
router.use(authController.checkLogin);
router.get('/cart/current/:id', cartController.getCurrentCart)


module.exports = router;
