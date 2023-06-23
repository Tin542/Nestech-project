"use strict";
const xlsx = require("xlsx");
const fs = require("fs");

const Product = require("../models/product").Product;
const Promotion = require("../models/promotion").Promotion;
const User = require("../models/user").User;
const Staff = require("../models/staff").Staff;

function AdminController() {
  // chua global var
  const SELF = {
    SIZE: 5,
    mapStaffToExportData: (staff) => {
      return {
        fullname: staff.fullname,
        username: staff.username,
        phone: staff.phone,
        email: staff.email,
        active: staff.active,
      };
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
        const Promotion = await Promotion.findById(pId);
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
    addStaff: async (req, res) => {
      const file = req.files;
      if (!file) {
        return res.json({ s: 400, msg: "No files" });
      }

      //Lưu file vào thư mục tạm
      const excelFile = file.file;
      excelFile.mv(__dirname + "/uploads/" + excelFile.name, (err) => {
        if (err) {
          return res.json({ s: 400, msg: err });
        }
        //__dirname: C://Desktop//work//Neshctech/NESHTECH-EC/services
        const workbook = xlsx.readFile(
          __dirname + "/uploads/" + excelFile.name
        );
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 2 });

        data.forEach(async (item, index) => {
          let result = await Staff.create(item);
          if (!result) {
            return res.json({ s: 400, msg: result });
          }
        });
        return res.redirect("list");
      });
    },
    exportStaff: async (req, res) => {
      try {
        await Staff.find()
          .then(async (rs) => {
            let staffArray = [];
            if (rs.length > 0) {
              await rs.forEach( async(item, index) => {
                await staffArray.push(SELF.mapStaffToExportData(item)); 
              });
            }
            console.log(staffArray);

            const workbook = xlsx.utils.book_new();
            const worksheet = xlsx.utils.json_to_sheet(staffArray);
            xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

            // Tạo file Excel tạm thời
            const tempFilePath = "temp.xlsx";
            xlsx.writeFile(workbook, tempFilePath);

            // Gửi file Excel về cho người dùng tải xuống
            res.download(tempFilePath, "data.xlsx", (err) => {
              // Xóa file Excel tạm thời sau khi đã gửi
              fs.unlink(tempFilePath, (err) => {
                if (err) {
                  console.error(err);
                }
              });
            });
          })
          .catch((err) => {
            console.log("error get list at export", err);
          });
      } catch (error) {
        console.log("error at export: ", error);
      }
    },
  };
}

module.exports = new AdminController();
