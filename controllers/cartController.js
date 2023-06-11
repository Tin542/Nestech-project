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
          productID: product._id,
          userID: uid,
          productName: product.name,
          productImg: product.imageUrl,
          productPrice: product.price,
          quantity: 1,
        })
          .then((rs) => {
            return "Đã thêm vào giỏ hàng";
          })
          .catch((err) => {
            console.log("cart error", err);
          });
      } catch (error) {
        console.log("error creating cart: ", error);
      }
    },
    updateCart: async (cartId, quantity) => {
      try {
        let detailCart = await Cart.findById(cartId);
        if (!detailCart) {
          return console.log("cart not found");
        }
        return Cart.findByIdAndUpdate(cartId, { quantity: quantity })
          .then((rs) => {
            return "Đã cập nhật giỏ hàng";
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log("error updating cart: ", error);
      }
    },
    getTotalPrice: (listCart) => {
      let total = 0;
      listCart.forEach((item) => {
        total = total + item.productPrice * item.quantity;
      });
      return total;
    },
  };
  return {
    checkCart: async (req, res) => {
      try {
        let uid = res.locals.user; // get current user id
        let pid = req.params?.id; // get current product id
        let product = await Product.findById(pid);

        if (!product) {
          return res.json({ s: 404, msg: "Product not found" });
        }

        const result = await Cart.findOne({
          $and: [{ productID: pid }, { userID: uid }],
        }).lean();
        if (!result) {
          let msg = await SELF.createCart(uid, product, res);
          return res.json({ s: 200, msg: msg });
        }
        let quantity = (await result.quantity) + 1;
        let msg = await SELF.updateCart(result._id, quantity, res);
        return res.json({ s: 200, msg: msg });
      } catch (error) {
        console.log("get cart error", error);
      }
    },
    getCurrentCart: (req, res) => {
      try {
        let uid = res.locals.user; // get current user id
        return Cart.find({ userID: uid })
          .then((rs) => {
            if (rs) {
              let totalPrice = SELF.getTotalPrice(rs);
              res.render("pages/cart.ejs", {
                cartitems: rs,
                totalPrice: totalPrice,
              });
            }
          })
          .catch((err) => {
            console.log("getListCart error", err);
          });
      } catch (error) {
        console.log("getListCart error", error);
      }
    },
    addItem: async (req, res) => {
     
      try {
        let cid = req.params?.id;
        let cartDetail = await Cart.findById(cid);
        if (!cartDetail) return res.json({ s: 404, msg: "Cart not found" });
        let upQuantity = Number.parseInt( (await cartDetail.quantity) + 1);
        return Cart.findByIdAndUpdate(cid, { quantity: upQuantity })
          .then(() => {
            // window.location.reload();
            res.redirect(req.get('/cart'));
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log("addItem error", error);
      }
    },
  };
}

module.exports = new CartController();
