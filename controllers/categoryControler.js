"use strict";
const moment = require("moment");
const category = require("../models/category").category;
function categoryControler() {
  // chua global var
  const SELF = {
    SIZE: 5,
    formatDateToString: (date) => {
      return moment(date).format("DD/MM/YYYY, h:mm:ss a");
    },
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
        let categoryCount = await category
          .find({ name: regex })
          .countDocuments(); // lấy tổng số pategory hiện có
        let pageCount = 0; // tổng số trang
        if (categoryCount % SELF.SIZE !== 0) {
          // nếu tổng số category chia SIZE có dư
          pageCount = Math.floor(categoryCount / SELF.SIZE) + 1; // làm tròn số xuống cận dưới rồi + 1
        } else {
          pageCount = categoryCount / SELF.SIZE; // nếu ko dư thì chia bth
        }
        return category
          .find({ name: regex }).sort({updatedAt: -1})
          .skip(skip) // số item bỏ qua ==> skip = (số trang hiện tại - 1) * số item ở mỗi trang
          .limit(SELF.SIZE) // số item ở mỗi trang
          .then((rs) => {
            res.render("pages/admin/adminPage", {
              category: rs,
              pages: pageCount,
              promotion: null,
              staffs: null,
              users: null,
              urlUploaded: null,
              products: null,
              orders: null,
              dashboard: null,
            });
          })
          .catch((error) => {
            res.send({ s: 400, msg: error });
          });
      } catch (error) {
        console.log(error);
      }
    },
    addcategory: async (req, res) => {
      try {
        let data = req.body;
        data.addDate = SELF.formatDateToString(new Date());
        data.editDate = SELF.formatDateToString(new Date());
        return category
          .create(data)
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
    getcategorydetail: async (req, res) => {
      try {
        let categoryId = req.params?.id;
        let result = await category.findById(categoryId);

        if (!result) {
          return res.json({ s: 404, msg: "Category not found" });
        }
        return res.json({ s: 200, data: result });
      } catch (error) {
        console.log("Get Detail error: " + error);
      }
    },
    editcategory: async (req, res) => {
      try {
        let editData = req.body;
        let detailcategory = await category.findById(editData._id);
        if (!detailcategory) {
          res.json({ s: 404, msg: "category not found" });
        }
        delete editData._id; // xoa field id trong editData
        editData.editDate = SELF.formatDateToString(new Date());
        return category
          .findByIdAndUpdate(detailcategory._id, editData)
          .then((rs) => {
            if (rs) {
              res.redirect("/admin/category/list");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log("edit category error: ", error);
      }
    },
    deletecategory: async (req, res) => {
      try {
        const pId = req.params?.id;
      
        const categoryDetail = await category.findById(pId);
        if (!categoryDetail) {
          return res.json({ s: 404, msg: "category not found" });
        }
        category
          .deleteOne({ _id: pId })
          .then((rs) => {
            return res.json({ s: 200, msg: "Delete category success!!" });
          })
          .catch((e) => {
            console.log(`deletecategory - fail: ${e}`);
            return rs.json({ s: 400, msg: "deletecategory fail" });
          });
      } catch (error) {
        console.log(error);
      }
    },
  };
}
module.exports = new categoryControler();
