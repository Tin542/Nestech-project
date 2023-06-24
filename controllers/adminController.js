"use strict";
const Product = require("../models/product").Product;
const Promotion = require("../models/promotion").Promotion;
const User = require("../models/user").User;
const Staff = require("../models/staff").Staff;
const moment = require("moment");
const dateService = require("../services/date");

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
              promotion: null,
              pages: pageCount, // tổng số trang
              users: null,
              urlUploaded: null,
              staffs: null,
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

    getPromotionList: async (req, res) => {
      try {
        let productIdList = [];
        let page = req.query.page;
        let keySearch = req.query.searchValue || "";
        if (!page || parseInt(page) <= 0) {
          page = 1;
        }
        let skip = (parseInt(page) - 1) * SELF.SIZE;
        let regex = new RegExp(keySearch);

        // pagination
        let promotionCount = await Promotion.find({
          name: regex,
        }).countDocuments(); // lấy tổng số promotion hiện có
        let pageCount = 0; // tổng số trang
        if (promotionCount % SELF.SIZE !== 0) {
          // nếu tổng số promotion chia SIZE có dư
          pageCount = Math.floor(promotionCount / SELF.SIZE) + 1; // làm tròn số xuống cận dưới rồi + 1
        } else {
          pageCount = promotionCount / SELF.SIZE; // nếu ko dư thì chia bth
        }
        productIdList = await Product.find();
        return Promotion.find({ name: regex })
          .skip(skip) // số trang bỏ qua ==> skip = (số trang hiện tại - 1) * số item ở mỗi trang
          .limit(SELF.SIZE) // số item ở mỗi trang
          .then((rs) => {
            for (let i = 0, ii = rs.length; i < ii; i++) {
              let startDateFM = moment(rs[i].startDate).format(
                "DD/MM/YYYY, h:mm:ss a"
              );
              let endDateFM = moment(rs[i].endDate).format(
                "DD/MM/YYYY, h:mm:ss a"
              );
              console.log("s: ", startDateFM)
              console.log("e: ", endDateFM)
              // rs[i].startDate = rs[i].startDate.replace(
              //   rs[i].startDate,
              //   startDateFM
              // );
              // rs[i].endDate = rs[i].endDate.replace(
              //   rs[i].endDate,
              //   endDateFM
              // );
              // console.log("startDate: ", rs[i].startDate);
              // console.log("endDate: ", rs[i].endDate);
            }
            // console.log(rs);
            res.render("pages/admin/adminPage", {
              promotion: rs,
              products: null,
              pages: pageCount, // tổng số trang
              users: null,
              urlUploaded: null,
              productIdList: productIdList,
              staffs: null,
            });
          })
          .catch((error) => {
            res.send({ s: 400, msg: error });
          });
      } catch (error) {
        console.log(error);
      }
    },
    addPromotion: async (req, res) => {
      try {
        let data = req.body;
        console.log("Data: ", data);
        return Promotion.create(data)
          .then((rs) => {
            return rs;
          })
          .catch((err) => {
            res.send({ s: 400, msg: err });
          });
      } catch (error) {
        console.log(error);
      }
    },
    getPromotionDetail: async (req, res) => {
      try {
        let promotionId = req.params?.id;
        let result = await Promotion.findById(promotionId);
        if (!result) {
          return res.json({ s: 404, msg: "Promotion not found" });
        }
        return res.json({ s: 200, data: result });
      } catch (error) {
        console.log("Get Detail error: " + error);
      }
    },
    editPromotion: async (req, res) => {
      try {
        let editData = req.body;
        let detailPromotion = await Promotion.findById(editData._id);
        if (!detailPromotion) {
          res.json({ s: 404, msg: "Promotion not found" });
        }
        delete editData._id; // xoa field id trong editData
        return Promotion.findByIdAndUpdate(detailPromotion._id, editData)
          .then((rs) => {
            if (rs) {
              res.redirect("/admin/promotion/list");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log("edit promotion error: ", error);
      }
    },
    deletePromotion: async (req, res) => {
      try {
        const pId = req.params?.id;
        const promotion = await Promotion.findById(pId);
        if (!promotion) {
          return res.json({ s: 404, msg: "Promotion not found" });
        }
        Promotion.deleteOne({ _id: pId })
          .then((rs) => {
            return res.json({ s: 200, msg: "Delete promotion success!!" });
          })
          .catch((e) => {
            console.log(`deletePromotion - fail: ${e}`);
            return rs.json({ s: 400, msg: "deletePromotion fail" });
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
              promotion: null,
              pages: pageCount, // tổng số trang
              users: rs,
              urlUploaded: null,
              staffs: null,
            });
          })
          .catch((error) => {
            res.send({ s: 400, msg: error });
          });
      } catch (error) {
        console.log(error);
      }
    },

    staffs: async (req, res) => {
      try {
        let page = req.query.page;
        let keySearch = req.query.searchValue || "";
        if (!page || parseInt(page) <= 0) {
          page = 1;
        }
        let skip = (parseInt(page) - 1) * SELF.SIZE;
        let regex = new RegExp(keySearch);

        // pagination
        let userCount = await Staff.find({
          $or: [{ fullname: regex }, { username: regex }],
        }).countDocuments(); // lấy tổng số product hiện có
        let pageCount = 0; // tổng số trang
        if (userCount % SELF.SIZE !== 0) {
          // nếu tổng số product chia SIZE có dư
          pageCount = Math.floor(userCount / SELF.SIZE) + 1; // làm tròn số xuống cận dưới rồi + 1
        } else {
          pageCount = userCount / SELF.SIZE; // nếu ko dư thì chia bth
        }

        return Staff.find({ $or: [{ fullname: regex }, { username: regex }] })
          .skip(skip) // số item bỏ qua ==> skip = (số trang hiện tại - 1) * số item ở mỗi trang
          .limit(SELF.SIZE) // số item ở mỗi trang
          .then((rs) => {
            res.render("pages/admin/adminPage", {
              products: null,
              pages: pageCount, // tổng số trang
              users: null,
              urlUploaded: null,
              staffs: rs,
              promotion: null,
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
