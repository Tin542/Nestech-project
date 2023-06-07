const express = require("express"); // import express
const app = express(); // khai bao
const CONFIG = require("./config");
const home = require('./routes/home');
const admin = require('./routes/admin');
const auth = require('./routes/auth');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

// MongoDB connection
const db = CONFIG.MONGODB_URL;
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Connected to mongodb =(^.^)="))
  .catch((err) => console.log('failed to connect to mongodb =(T.T)='));

app.set("view engine", "ejs");
app.use('/public', express.static('public'));
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
  next();
});
app.use("/", home);

app.listen(CONFIG.PORT, () => {
  console.log(`Example app listening on port ${CONFIG.PORT}`);
});

// pody-parser 
// define form view
// ajax: là 1 phương thức để call API (axios, fetch, request, http,...)
