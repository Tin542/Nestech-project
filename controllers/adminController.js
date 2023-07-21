"use strict";
const xlsx = require("xlsx");
const fs = require("fs");
const moment = require("moment");
const  ObjectID = require('mongodb').ObjectId;

const Product = require("../models/product").Product;
const Promotion = require("../models/promotion").Promotion;
const User = require("../models/user").User;
const Staff = require("../models/staff").Staff;
const Category = require("../models/category").category;
const Order = require("../models/order").Order;
const OrderDetail = require("../models/orderDetail").OrderDetail;

function AdminController() {
  
  // chua global var
  const SELF = {
    SIZE: 10,
    ORDER_STATUS: {
      PENDING: 'pending', // đang xử lý
      APPROVED: 'approved', // đã xác nhận
      REJECTED: 'rejected', // đã hủy
      DELIVERING: 'delivering', // đang giao hàng
      SUCCESS: 'success', // đã hoàn thành
    },
    mapStaffToExportData: (staff) => {
      return {
        fullname: staff.fullname,
        username: staff.username,
        phone: staff.phone,
        email: staff.email,
        active: staff.active,
      };
    },
    formatDateToString: (date) => {
      return moment(date).format("DD/MM/YYYY, h:mm:ss a");
    },
    getAllCategories: () => {
      return Category.find()
        .then()
        .catch((error) => {
          console.error(error);
        });
    },
    // Dashboard
    getRevenueInMonth: async (month, year) => {
      // let totalPriceInDay = 0;
      let totalDayinMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth(); // get total date in 1 month

      let startDateOfMonth = `${year}-${month}-01`;
      let endDateOfMonth = `${year}-${month}-${totalDayinMonth}`;

      let listOrderInDay = await Order.find({
        createdAt: {
          $gte: new Date(`${startDateOfMonth}T00:00:00`),
          $lte: new Date(`${endDateOfMonth}T23:59:59`),
        },
      });
      const totalPriceInMonth = listOrderInDay.reduce(
        (accumulator, currentValue) => accumulator + currentValue.totalPrice,
        0
      );
      return totalPriceInMonth;
    },
    getPopularProduct: async () => {
      try {
        let listOrderDetails = await OrderDetail.find();
        // Đếm số lần xuất hiện
        let arrayResult = [];
        for (let i = 0; i < listOrderDetails.length; i++) {
          let idx = arrayResult.findIndex(
            (el) => el.pid === listOrderDetails[i].productID
          );
          if (idx > -1) {
            arrayResult[idx]["count"] += 1;
          } else {
            arrayResult.push({
              pid: listOrderDetails[i].productID,
              count: 1,
            });
          }
        }
        arrayResult.sort((a, b) => b.count - a.count); // sort list theo thứ tự giảm dần count
        return arrayResult.slice(0, 10); // lấy 10 pid đầu tiên
      } catch (error) {
        console.log("error: " + error);
      }
    },
    getPopularCategories: async () => {
      try {
        let listCateId = []; // list category id
        let arrResult = []; // list result
        let listOrderDetails = await OrderDetail.find(); // get all order details
        // lấy list category id dựa trên productID trong orderDetail
        for (let i = 0; i < listOrderDetails.length; i++) {
          let pDetail = await Product.findById(listOrderDetails[i].productID);
          listCateId.push(pDetail.categoryId);
        }
        // đếm số lần category xuất hiện
        for (let i = 0; i < listCateId.length; i++) {
          let idx = arrResult.findIndex((el) => el.cid === listCateId[i]);
          if (idx > -1) {
            arrResult[idx]["count"] += 1;
          } else {
            arrResult.push({
              cid: listCateId[i],
              count: 1,
            });
          }
        }
        arrResult.sort((a, b) => b.count - a.count); // sort list theo thứ tự giảm dần count
        return arrResult.slice(0, 3); // lấy 3 cid đầu tiên
      } catch (error) {
        console.log("error: " + error);
      }
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

        //get all categories
        let category = await SELF.getAllCategories();

        // pagination
        Promise.all([
          // 2 hàm bên trong sẽ thực thi đồng thời ==> giảm thời gian thực thi ==> improve performance
          Product.countDocuments({ name: regex }).lean(), // Lấy tổng số product
          Product.find({ name: regex })
            .sort({ updatedAt: -1 })
            .skip(skip) // số trang bỏ qua ==> skip = (số trang hiện tại - 1) * số item ở mỗi trang
            .limit(SELF.SIZE)
            .lean(), // số item ở mỗi trang
        ])
          .then(async (rs) => {
            // rs trả ra 1 array [kết quả của function 1, kết quả của function 2, ..]
            let productCount = rs[0]; // tổng số product
            let pageCount = 0; // tổng số trang
            if (productCount % SELF.SIZE !== 0) {
              // nếu tổng số product chia SIZE có dư
              pageCount = Math.floor(productCount / SELF.SIZE) + 1; // làm tròn số xuống cận dưới rồi + 1
            } else {
              pageCount = productCount / SELF.SIZE; // nếu ko dư thì chia bth
            }

            for (let i = 0; i < rs[1].length; i++) {
              let catInfo = await Category.findById(rs[1][i].categoryId).lean();
              rs[1][i]["catName"] = catInfo.name;
            }
            //test
            const testtt = await SELF.getRevenueInMonth("07", "2023");
            console.log("test revenue in month: ", testtt);

            const testPopPd = await SELF.getPopularProduct();
            console.log("test poppd: ", testPopPd);

            const testPopCate = await SELF.getPopularCategories();
            console.log("test popcate: ", testPopCate);

            res.render("pages/admin/adminPage", {
              products: rs[1],
              promotion: null,
              category: null,
              pages: pageCount, // tổng số trang
              users: null,
              urlUploaded: null,
              staffs: null,
              listCategories: category,
              orders: null,
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
        data.rate = 0;
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
    // Promotion
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
              category: null,
              pages: pageCount, // tổng số trang
              users: null,
              urlUploaded: null,
              productIdList: productIdList,
              staffs: null,
              orders: null,
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
        data.startDate = SELF.formatDateToString(data.startDate);
        data.endDate = SELF.formatDateToString(data.endDate);

        return Promotion.create(data)
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
    // user
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
        Promise.all([
          // 2 hàm bên trong sẽ thực thi đồng thời ==> giảm thời gian thực thi ==> improve performance
          User.countDocuments({
            $or: [{ fullname: regex }, { username: regex }],
          }).lean(), // Lấy tổng số product
          User.find({
            $or: [{ fullname: regex }, { username: regex }],
          })
            .sort({ createdAt: -1 })
            .skip(skip) // số trang bỏ qua ==> skip = (số trang hiện tại - 1) * số item ở mỗi trang
            .limit(SELF.SIZE)
            .lean(), // số item ở mỗi trang
        ])
          .then(async (rs) => {
            // rs trả ra 1 array [kết quả của function 1, kết quả của function 2, ..]
            let productCount = rs[0]; // tổng số product
            let pageCount = 0; // tổng số trang
            if (productCount % SELF.SIZE !== 0) {
              // nếu tổng số product chia SIZE có dư
              pageCount = Math.floor(productCount / SELF.SIZE) + 1; // làm tròn số xuống cận dưới rồi + 1
            } else {
              pageCount = productCount / SELF.SIZE; // nếu ko dư thì chia bth
            }

            for (let i = 0; i < rs[1].length; i++) {
              let total = await Order.find({userID: rs[1][i]._id}).lean();
              if(total){
                rs[1][i]["orders"] = total.length;
              }
               
            }
            res.render("pages/admin/adminPage", {
              products: null,
              promotion: null,
              category: null,
              pages: pageCount, // tổng số trang
              users: rs[1],
              urlUploaded: null,
              staffs: null,
              orders: null,
            });
          })
          .catch((error) => {
            res.send({ s: 400, msg: error });
          });
      } catch (error) {
        console.log(error);
      }
    },
    activeUser: async(req, res) => {
      try {
        let uid = req.body.uid;
        return User.findByIdAndUpdate(uid, {active: true})
        .then((rs) => {
          if (rs) {
            res.redirect("/admin/user/list");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      } catch (error) {
        console.log(error);
      }
    },
    blockUser: async(req, res) => {
      try {
        let uid = req.body.uid;
        return User.findByIdAndUpdate(uid, {active: false})
        .then((rs) => {
          if (rs) {
            res.redirect("/admin/user/list");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      } catch (error) {
        console.log(error);
      }
    },
    // Staff
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
              category: null,
              pages: pageCount, // tổng số trang
              users: null,
              urlUploaded: null,
              staffs: rs,
              promotion: null,
              orders: null,
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
              await rs.forEach(async (item, index) => {
                staffArray.push(SELF.mapStaffToExportData(item));
              });
            }

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
    // Orders
    orders: async (req, res) => {
      try {
        let page = req.query.page;
        let idSearch = req.query.id || '';
        let statusSearch = req.query.status || '';
        let isPaidSearch = req.query.isPaid || '';
        let filter = {};

        if (idSearch) {
          filter["_id"] = new ObjectID(idSearch);
        }
        if (statusSearch) {
          filter["status"] = statusSearch
        }
        if (isPaidSearch) {
          filter["isPaid"] = /^true$/i.test(isPaidSearch);
        }

        if (!page || parseInt(page) <= 0) {
          page = 1;
        }
        let skip = (parseInt(page) - 1) * SELF.SIZE;

        // pagination
        Promise.all([
          // 2 hàm bên trong sẽ thực thi đồng thời ==> giảm thời gian thực thi ==> improve performance
          Order.countDocuments(filter).lean(), // Lấy tổng số product
          Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip) // số trang bỏ qua ==> skip = (số trang hiện tại - 1) * số item ở mỗi trang
            .limit(SELF.SIZE)
            .lean(), // số item ở mỗi trang
        ])
          .then(async (rs) => {
            // rs trả ra 1 array [kết quả của function 1, kết quả của function 2, ..]
            let productCount = rs[0]; // tổng số product
            let pageCount = 0; // tổng số trang
            if (productCount % SELF.SIZE !== 0) {
              // nếu tổng số product chia SIZE có dư
              pageCount = Math.floor(productCount / SELF.SIZE) + 1; // làm tròn số xuống cận dưới rồi + 1
            } else {
              pageCount = productCount / SELF.SIZE; // nếu ko dư thì chia bth
            }
            res.render("pages/admin/adminPage", {
              products: null,
              promotion: null,
              category: null,
              pages: pageCount, // tổng số trang
              users: null,
              urlUploaded: null,
              staffs: null,
              orders: rs[1],
              filters: {
                idInput: idSearch || '',
                statusSelectd: statusSearch || '',
                paidSelectd: isPaidSearch || ''
              }
            });
          })
          .catch((error) => {
            res.send({ s: 400, msg: error });
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
}

module.exports = new AdminController();
