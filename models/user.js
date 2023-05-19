"use strict";
const mongoose = require("mongoose");

// define model schema
const User = mongoose.Schema(
  {
    username: { type: String },
    password: { type: String },
    fullname: { type: String },
    email: { type: String },
    phone: { type: String },
    gender: { type: String },
  },
  { version: false, timestamps: true }
);

// define ID of object
User.statics.objectId = function (id) {
  return mongoose.Types.objectId(id);
};

// export models
module.exports = {
  Product: mongoose.model("user", User),
};