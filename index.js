const express = require("express"); // import express
const app = express(); // khai bao
const CONFIG = require("./config");
const home = require('./routes/home')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// MongoDB connection
const db = CONFIG.MONGODB_URL;
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Connected to mongodb =(^.^)="))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/", home);

app.listen(CONFIG.PORT, () => {
  console.log(`Example app listening on port ${CONFIG.PORT}`);
});

// pody-parser 
// define form view
// ajax: là 1 phương thức để call API (axios, fetch, request, http,...)
