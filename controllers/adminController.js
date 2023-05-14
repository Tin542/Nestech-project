"use strict";
const Product = require("../models/product").Product;

function AdminController() {
  // chua global var
  const SELF = {

  };
  return {
    home: (req, res) => {
      try {
        return Product.find()
          .then((rs) => {
            res.render("pages/admin/adminPage", {
              products: rs,
              users: null,
              urlUploaded: null,
            });
          })
          .catch((error) => {
            res.json({ s: 400, msg: error });
          });
      } catch (error) {
        console.log(error);
      }
    },
    users: (req, res) => {
      return res.render("pages/admin/adminPage", {
        users: [],
        products: null,
        urlUploaded: null
      });
    },
  };
}

module.exports = new AdminController();
