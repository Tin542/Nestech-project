"use strict";
const mongoose = require("mongoose");

// define model schema
const Cart = mongoose.Schema(
  {
    products: { type: Array },
    userID: { type: String },
  },
  { version: false, timestamps: true }
);

// define ID of object
Cart.statics.objectId = function (id) {
  return mongoose.Types.objectId(id);
};

// export models
module.exports = {
  Cart: mongoose.model("cart", Cart),
};
