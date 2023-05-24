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
        return Product.find({ rate: 5 })
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
  };
}

module.exports = new HomeController();
