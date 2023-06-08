"use strict";
const Cart = require("../models/cart").Cart;
// const User = require("../models/user").User;

function AdminController() {
  // chua global var
  const SELF = {
    SIZE: 5,
  };
  return {
    createCart: async (req, res) => {
      try {
        
      } catch (error) {
        console.log(error);
      }
    }

    
  };
}

module.exports = new AdminController();
