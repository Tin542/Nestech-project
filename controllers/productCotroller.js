"use strict";
const Product = require("../models/product").Product;

function ProductController() {
  // chua global var
  const SELF = {};
  return {
    getList: (req, res) => {
      try {
        return Product.find()
          .then((rs) => {
            res.render("pages/productList", {
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
    addProduct: (req, res) => {
      try {
        let data = req.body;
        console.log('data create', data);
        return Product.create(data)
          .then((rs) => {
            return res.redirect("/products");
          })
          .catch((err) => {
            res.send({ s: 400, msg: err });
          });
      } catch (error) {
        console.log(error);
      }
    },
  };
}

module.exports = new ProductController();