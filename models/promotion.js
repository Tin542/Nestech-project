"use strict";
const mongoose = require("mongoose");

// define model schema
const Promotion = mongoose.Schema(
  {
    name: { type: String },
    GiamGia: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    code: { type: String },
    desc: { type: String },
  },
  { version: false, timestamps: true }
);

// define ID of object
Promotion.statics.objectId = function (id) {
  return mongoose.Types.objectId(id);
};

// export models
module.exports = {
  Promotion: mongoose.model("promotion", Promotion),
};

// var element = document.getElementById("myElement");
// element.addEventListener("click", function () {
//   if (element.style.height === "300px") {
//     element.style.height = "0px";
//   } else {
//     element.style.height = "300px";
//   }
// });
