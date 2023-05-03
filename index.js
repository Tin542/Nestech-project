const express = require("express"); // import express
const app = express(); // khai bao
const CONFIG = require("./config");
const mongoose = require("mongoose");

// MongoDB connection
const db = CONFIG.MONGODB_URL;
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Connected to mongodb (^.^)"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use('/public', express.static('public'));

// Routes
app.use("/", require("./routes/home"));

app.listen(CONFIG.PORT, () => {
  console.log(`Example app listening on port ${CONFIG.PORT}`);
});

// tao repo ==> readme.md: họ tên mem, mongo url, invite
// vô mongo atlas tạo db ==> database ==> network access: tạo ip
// tạo trello ==> workspace ==> invite

// view (trang chủ)
