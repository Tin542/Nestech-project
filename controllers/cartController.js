"use strict";
const Cart = require("../models/cart").Cart;
// const User = require("../models/user").User;

function CartController() {
  // chua global var
  const SELF = {
    
  };
  return {
    getCurrentCart: async (req, res) => {
      try {
        let userID = res.locals.user; // get current user id
        let result = await Cart.findOne({userID});
        if(!result){
          console.log("cart not found !")
        }
        else {
          console.log('cart founded successfully');
        }
      } catch (error) {
        console.log(error);
      }
    },
    createCart: async (req, res) => {
      try {
        console.log('test create cart')
      } catch (error) {
        console.log(error);
      }
    }

    
  };
}

module.exports = new CartController();
