const express = require("express");
const homeController = require("../controllers/homeController");
const router = express.Router({});

router.get("/", homeController.home);

// Products
router.get("/products", homeController.getList);
router.get("/products/detail/:id", homeController.getProductDetail);

// Cart
router.get("/cart", (req, res) => {
  res.render("pages/cart.ejs");
});

module.exports = router;
