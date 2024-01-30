"use strict";
const moment = require("moment");

const User = require("../models/user").User;
const Order = require("../models/order").Order;

function userController() {
  const SELF = {
    formatDateToString: (date) => {
      return moment(date).format("DD/MM/YYYY, h:mm:ss a");
    },
  };
  return {
    getCurrentUser: async (req, res) => {
      try {
        let uid = res.locals.user; // get current user id
        const result = await User.findById(uid);
        const listOrder = await Order.find({ userID: uid }).sort({ createdAt: -1 });
        listOrder.forEach(element => {
          element.createDate = SELF.formatDateToString(element.createAt);
        });
        if (!result) {
          return res.json({ s: 404, msg: "User not found" });
        }
        return res.render("../views/pages/user/profilePage.ejs", {
          item: result,
          listOrder: listOrder,
        });
      } catch (error) {}
    },
    getDetailOrder: async (req, res) => {
      try {
        let oid = req.params.id;
        let order = await Order.findById(oid);
        if (order) {
          await OrderDetail.find({ orderID: order._id })
            .then((rs) => {
              return res.render("pages/admin/adminPage", {
                products: null,
                promotion: null,
                category: null,
                users: null,
                staffs: null,
                orders: null,
                dashboard: null,
                orderDetail: order,
                listProduct: rs,
              });
            })
            .catch((error) => console.log(error));
        } else {
          return res.json({ s: 404, msg: "Order not found" });
        }
      } catch (error) {
        console.log("error", error);
      }
    },
  };
}

module.exports = new userController();
