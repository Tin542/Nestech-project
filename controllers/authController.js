"use strict";
const User = require("../models/user").User;
const bcrypt = require("bcrypt"); // encrypt password
const jwt = require("jsonwebtoken");
const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./localStorage");
const CONFIG = require("../config");

function AuthController() {
  // chua global var
  const SELF = {
    enCodePass: (password) => {
      return bcrypt
        .hash(password, 10) // change encode password - 10 : salt
        .then((hash) => {
          return Promise.resolve(hash);
        })
        .catch((err) => {
          Logger.error(`encrypt password fail: ${err}`);
        });
    },
  };
  return {
    register: async (req, res) => {
      try {
        let data = req.body; // data register

        // check validate
        if (
          !data?.fullname ||
          !data?.username ||
          !data?.email ||
          !data?.password
        ) {
          return res.json({ s: 400, msg: "Vui lòng điền đầy đủ thông tin" });
        }
        if (data?.password !== data?.rePassword) {
          return res.json({ s: 400, msg: "Mật khẩu chưa trùng khớp" });
        }

        // check if user is already registered
        const userInfo = await User.findOne({
          $or: [{ email: data?.email }, { username: data?.username }], // find user by email or username
        }).lean(); // lean() => tăng hiệu suất truy vấn
        if (userInfo) {
          return res.json({ s: 400, msg: "Username hoặc email đã tồn tại" });
        }

        // register user
        return SELF.enCodePass(data?.password).then((hash) => {
          let otp = (Math.random() + 1).toString(36).substring(6); // create random OTP
          return User.create({
            fullname: data?.fullname,
            username: data?.username,
            password: hash,
            email: data?.email,
            otp: otp,
          })
            .then(async (rs) => {
              await localStorage.setItem("email", data?.email);
              return res.redirect("/auth/verifyEmail");
            })
            .catch((err) => {
              console.log("register user error: ", err);
            });
        });
      } catch (error) {
        console.log("register error: ", error);
      }
    },
    verify: async (req, res) => {
      try {
        let data = req.body;
        if (!data?.otp) {
          return res.json({ s: 400, msg: "Vui long nhap OTP" });
        }
        const emailLocalStorage = await localStorage.getItem("email");
        return User.findOne({ otp: data?.otp, email: emailLocalStorage })
          .lean()
          .then(async (userInfo) => {
            if (userInfo) {
              userInfo.active = true;
              userInfo.otp = "";
              await User.updateOne({ _id: userInfo._id }, userInfo);
              res.redirect("/auth/login");
            } else {
              return res.json({ s: 400, msg: "OTP chua chinh xac" });
            }
          })
          .catch((e) => {
            Logger.error(`Find one user fail: ${e}`);
          });
      } catch (error) {
        Logger.error(`verify - fail: ${error}`);
      }
    },
    login: async(req, res) => {
      try {
        let data = req.body;
        if (!data?.username || !data?.password) {
          return res.json({ s: 400, msg: "Username hoặc pasowrd đang trống" });
        }
        let userInfo = await User.findOne({ username: data?.username }).lean();
        if (!userInfo) {
          return res.json({ s: 404, msg: `Username ${data?.username} Không tồn tại` });
        }
        if (!userInfo.active) {
          return res.json({ s: 400, msg: `Username ${data?.username} chưa xác thực` });
        }
        return bcrypt
          .compare(data?.password, userInfo.password)
          .then(async (rs) => {
            if (rs) {
              const token = jwt.sign(
                {
                  userId: userInfo._id,
                  email: userInfo?.email,
                },
                CONFIG.SERECT_KEY,
                { expiresIn: "100h" }
              );
              userInfo.token = token;
              await User.updateOne({ _id: userInfo._id }, userInfo);
              res.redirect("/admin/products/list");
            } else {
              res.json({ s: 400, msg: "Password khong chinh xac" });
            }
          })
          .catch();
      } catch (error) {
        console.log('login error: ' + error);
      }
    }
  };
}

module.exports = new AuthController();
