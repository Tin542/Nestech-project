"use strict";
const Product = require("../models/product").Product;

function AdminController() {
  // chua global var
  const SELF = {};
  return {
    home: (req, res) => {
      try {
        return Product.find()
          .then((rs) => {
            res.render("pages/admin/adminPage", {
              products: rs,
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
    
  };
}

module.exports = new AdminController();
