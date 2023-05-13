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
    getListDB: () => {
      try {
        return Product.find();
      } catch (error) {
        console.log(error);
      }
    },
    addProduct: (req, res) => {
      try {
        let data = req.body;
        console.log("data create", data);
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
              res.redirect("/products");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log("edit product error: ", error);
      }
    },
    deleteProduct: async(req, res) => {
      try {
        const pId = req.params?.id;
        const product = await Product.findById(pId);
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

module.exports = new ProductController();
