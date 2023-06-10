"use strict";
const Cart = require("../models/cart").Cart;
const Product = require("../models/product").Product;
// const User = require("../models/user").User;

function CartController() {
  // chua global var
  const SELF = {
    createCart: async (uid, product) => {
      try {
        return Cart.create({
          userID: uid,
          products: [product],
          price: product.price,
        })
          .then((rs) => {
            console.log("cart created");
          })
          .catch((err) => {
            console.log("cart error", err);
          });
      } catch (error) {
        console.log("error creating cart: ", error);
      }
    },
  };
  return {
    getCurrentCart: async (req, res) => {
      try {
        let userID = res.locals.user; // get current user id
        let productID = req.params?.id; // get current product id
        let product = await Product.findById(productID);

        if (!product) {
          return res.json({ s: 404, msg: "Product not found" });
        }

        let result = await Cart.findOne({ userID });
        if (!result) {
          SELF.createCart(userID, product);
        } else {
          console.log("cart founded successfully");
        }
      } catch (error) {
        console.log(error);
      }
    },
  };
}

module.exports = new CartController();
