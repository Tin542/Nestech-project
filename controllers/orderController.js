"use strict";
const Cart = require("../models/cart").Cart;
const Product = require("../models/product").Product;
const User = require("../models/user").User;
const Order = require("../models/order").Order;
const OrderDetail = require("../models/orderDetail").OrderDetail;

function orderController() {
  const SELF = {
    mappingCreateItem: (item, oid, uid) => {
      return {
        productID: item.productID,
        orderID: oid,
        userID: uid,
        productName: item.productName,
        productImg: item.productImg,
        productPrice: item.productPrice,
        quantity: item.quantity,
      };
    },
    createOrderDetail: async (listCart) => {
      try {
        if (listCart.isArray()) {
          await listCart.forEach(async (item, index) => {
            let createResult = await OrderDetail.create(item); // Tạo order detail
            if (!createResult) {
              return console.log("create order detail failed");
            }
            await Cart.deleteOne(item._id); // xóa cart
          });
        }
      } catch (error) {
        console.log("errro at createOrderDetail", error);
      }
    },
  };

  return {
    createOrder: async (req, res) => {
      try {
        let createData = req.body;
        let uid = res.locals.user; // get current user id
        createData.userID = uid;
        let result = await Order.create(createData);
        console.log('result: ',result);
      } catch (error) {
        console.log("error at create order", error);
      }
    },
  };
}

module.exports = new orderController();
