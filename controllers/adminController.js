"use strict";
const Product = require("../models/product").Product;
const User = require("../models/user").User;

function AdminController() {
  // chua global var
  const SELF = {
    SIZE: 5,
  };
  return {
    getList: async (req, res) => {
      try {
        let page = req.query.page;
        let keySearch = req.query.searchValue || "";
        if (!page || parseInt(page) <= 0) {
          page = 1;
        }
        let skip = (parseInt(page) - 1) * SELF.SIZE;
        let regex = new RegExp(keySearch);

        // pagination
        let productCount = await Product.find({ name: regex }).countDocuments(); // lấy tổng số product hiện có
        let pageCount = 0; // tổng số trang
        if (productCount % SELF.SIZE !== 0) {
          // nếu tổng số product chia SIZE có dư
          pageCount = Math.floor(productCount / SELF.SIZE) + 1; // làm tròn số xuống cận dưới rồi + 1
        } else {
          pageCount = productCount / SELF.SIZE; // nếu ko dư thì chia bth
        }

        return Product.find({ name: regex })
          .skip(skip) // số trang bỏ qua ==> skip = (số trang hiện tại - 1) * số item ở mỗi trang
          .limit(SELF.SIZE) // số item ở mỗi trang
          .then((rs) => {
            res.render("pages/admin/adminPage", {
              products: rs,
              pages: pageCount, // tổng số trang
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
        if (!product) {
          return res.json({ s: 404, msg: "Product not found" });
        }
        Product.deleteOne({ _id: pId })
          .then((rs) => {
            
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
    users: async (req, res) => {
      try {
        let page = req.query.page;
        let keySearch = req.query.searchValue || "";
        if (!page || parseInt(page) <= 0) {
          page = 1;
        }
        let skip = (parseInt(page) - 1) * SELF.SIZE;
        let regex = new RegExp(keySearch);

        // pagination
        let userCount = await User.find({
          $or: [{ fullname: regex }, { username: regex }],
        }).countDocuments(); // lấy tổng số product hiện có
        let pageCount = 0; // tổng số trang
        if (userCount % SELF.SIZE !== 0) {
          // nếu tổng số product chia SIZE có dư
          pageCount = Math.floor(userCount / SELF.SIZE) + 1; // làm tròn số xuống cận dưới rồi + 1
        } else {
          pageCount = userCount / SELF.SIZE; // nếu ko dư thì chia bth
        }

        return User.find({ $or: [{ fullname: regex }, { username: regex }] })
          .skip(skip) // số item bỏ qua ==> skip = (số trang hiện tại - 1) * số item ở mỗi trang
          .limit(SELF.SIZE) // số item ở mỗi trang
          .then((rs) => {
            res.render("pages/admin/adminPage", {
              products: null,
              pages: pageCount, // tổng số trang
              users: rs,
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
  };
}

module.exports = new AdminController();
