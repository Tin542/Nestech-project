const express = require('express') // import express
const app = express() // khai bao
const CONFIG = require('./config');
const mongoose = require('mongoose');
const port = 3000

app.set('view engine', 'ejs');

app.use('/', require('./routes/home.route'));

app.listen(CONFIG.PORT, () => {
  console.log(`Example app listening on port ${CONFIG.PORT}`)
})

// tao repo ==> readme.md: họ tên mem, mongo url, invite
// vô mongo atlas tạo db ==> database ==> network access: tạo ip 
// tạo trello ==> workspace ==> invite

// view (trang chủ)

