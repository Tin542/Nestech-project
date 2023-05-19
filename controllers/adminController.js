"use strict";
const Product = require("../models/product").Product;

function AdminController() {
  // chua global var
  const SELF = {
    SIZE: 5,
  };
  return {
    getList: async (req, res) => {
      try {
        let page = req.query.page;
        let keySearch = req.query.keySearch;
        if (!page || parseInt(page) <= 0) {
          page = 1;
        }
        let skip = (parseInt(page) - 1) * SELF.SIZE;
        let regex = new RegExp(keySearch);
        return Product.find({ name: regex })
          .skip(skip)
          .limit(SELF.SIZE)
          .then((rs) => {
            res.render("pages/admin/adminPage", {
              products: rs,
              users: null,
              urlUploaded: null,
            });
          })
          .catch((error) => {
            res.send({ s: 400, msg: error });
          });
      } catch (error) {
        console.log(error);
      }
    },
    users: (req, res) => {
      return res.render("pages/admin/adminPage", {
        users: [],
        products: null,
        urlUploaded: null,
      });
    },
    addProduct: (req, res) => {
      try {
        let data = req.body;
        return Product.create(data)
          .then((rs) => {
            return res.redirect("list");
          })
          .catch((err) => {
            res.send({ s: 400, msg: err });
          });
      } catch (error) {
        console.log(error);
      }
    },
    getProductDetail: async (req, res) => {
      try {
        let productId = req.params?.id;
        let result = await Product.findById(productId);
        if (!result) {
          return res.json({ s: 404, msg: "Product not found" });
        }
        return res.json({ s: 200, data: result });
      } catch (error) {
        console.log("Get Detail error: " + error);
      }
    },
    editProduct: async (req, res) => {
      try {
        let editData = req.body;
        let detailProduct = await Product.findById(editData._id);
        if (!detailProduct) {
          res.json({ s: 404, msg: "Product not found" });
        }
        delete editData._id; // xoa field id trong editData
        return Product.findByIdAndUpdate(detailProduct._id, editData)
          .then((rs) => {
            if (rs) {
              res.redirect("/admin/products/list");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log("edit product error: ", error);
      }
    },
    deleteProduct: async (req, res) => {
      try {
        const pId = req.params?.id;
        const product = await Product.findById(pId);
        console.log("product delete", product);
        if (!product) {
          return res.json({ s: 404, msg: "Product not found" });
        }
        Product.deleteOne({ _id: pId })
          .then((rs) => {
            console.log(rs);
            return res.json({ s: 200, msg: "Delete product success!!" });
          })
          .catch((e) => {
            console.log(`deleteProduct - fail: ${e}`);
            return rs.json({ s: 400, msg: "deleteProduct fail" });
          });
      } catch (error) {
        console.log(error);
      }
    },
  };
}

module.exports = new AdminController();
