"use strict";
const Product = require("../models/product").Product;

function HomeController() {
  // chua global var
  const SELF = {
    SIZE: 8,
  };
  return {
    home: (req, res) => {
      try {
        return Product.find({ rate: 5 }) // Product.find()
          .limit(SELF.SIZE)
          .then((rs) => {
            res.render("pages/home", { listItems: rs });
          })
          .catch((err) => {
            console.error("get list at homeControlelr error: " + err);
          });
      } catch (error) {
        console.log("error at home controller", error);
      }
    },
    getProductDetail: async (req, res) => {
      try {
        let productId = req.params?.id;
        
        let result = await Product.findById(productId);
        console.log("Product", result);
        if (!result) {
          return res.json({ s: 404, msg: "Product not found" });
        }
        return res.render("pages/detail", { data: result });
      } catch (error) {
        console.error("get detail at homeControlelr error: " + err);
      }
    },
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
            res.render("pages/products.ejs", {
              listItems: rs,
              pages: pageCount, // tổng số trang
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

module.exports = new HomeController();
