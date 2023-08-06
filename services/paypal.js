const paypal = require("paypal-rest-sdk");
const OrderDetail = require("../models/orderDetail").OrderDetail;
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: "AY7HuuNKIVwTn3U9I9lhib0uFd3z4qkfxvz9SO8r3x_l__pvS5O76BRzj06DL9wBahLGpAnstVETQQxz",
  client_secret: "ENUeZbBgfeq8nab0wEdfUTBCzy8HONrGormPtIkzZJZjL6vXYPmGwP9RyM32B3Y0EQvdEr0sbyAUXZRq",
});

function PayPalService() {
  const SELF = {
    create_payment_json: {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "item",
                sku: "item",
                price: "1.00",
                currency: "USD",
                quantity: 1,
              },
              {
                name: "item",
                sku: "item",
                price: "1.00",
                currency: "USD",
                quantity: 2,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: "3.00",
          },
          description: "This is the payment description.",
        },
      ],
    },
  };
  return {
    pay: async (order) => {
      console.log('data', order); 
      let orderDetials = await OrderDetail.find({orderID: order._id});
      console.log('orderDetials', orderDetials);
      paypal.payment.create(SELF.create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          console.log("payment:");
          console.log(payment);
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              return payment.links[i].href;
            }
          }
        }
      });
    },
    success: (req, res) => {
      const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;

      const execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency: "USD",
              total: "3.00",
            },
          },
        ],
      };
      paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log(JSON.stringify(payment));
          res.send("Success");
        }
      });
    },
  };
}

module.exports = new PayPalService();
