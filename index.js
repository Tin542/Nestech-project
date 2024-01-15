const express = require("express"); // import express
const app = express(); // khai bao
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const path = require("path");
require('dotenv').config();
// require("./bin/www");
// const fileUpload = require('express-fileupload');

const home = require('./routes/home');
const admin = require('./routes/admin');
const auth = require('./routes/auth');
const user = require('./routes/user');

// MongoDB connection
const db = process.env.MONGODB_URL;
const port = process.env.PORT;

mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true, maxPoolSize: 20 })
  .then(() => console.log("Connected to mongodb =(^.^)="))
  .catch((err) => console.log('failed to connect to mongodb =(T.T)='));

app.set("view engine", "ejs");
app.use('/views', express.static('views'));

// app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  sessions({
    secret: "456456456",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
);

// Routes
app.use('/admin', admin);
app.use('/auth', auth);

app.use(function(req, res, next) {
  res.locals.user = req.session.userId;
  res.locals.cart = req.session.cart;
  next();
});
app.use("/", home);
app.use('/user', user);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// pody-parser 
// define form view
// ajax: là 1 phương thức để call API (axios, fetch, request, http,...)
