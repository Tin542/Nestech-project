"use strict";
const User = require("../models/user").User;

function AuthController() {
  // chua global var
  const SELF = {};
  return {
    register: (req, res) => {
      return res.render('../views/pages/auth/register.ejs')
    },
  };
}

module.exports = new AuthController();
