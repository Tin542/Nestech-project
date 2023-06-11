const sgMail = require("@sendgrid/mail");

function EmailService() {
  return {
    SendMailSG: (otp, emailCustomer) => {
      return new Promise((resolve, reject) => {
        // set up api key
        sgMail.setApiKey(
          "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"
        );

        // set up for email
        const msg = {
          to: emailCustomer, // email người nhận
          from: "ndhieuvegia983@gmail.com", // email người gửi
          subject: "Mã OTP để đăng kí tài khoản",// tiêu đề email
          // html: `` // nội dung email(style)
          text: `Mã OTP của bạn là ${otp}  =(^,^)=`, // nội dung email (text)
        };

        // send mail
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
            resolve(true);
          })
          .catch((error) => {
            console.log("Error Email: " + error);
          });
      });
    },
  };
}
module.exports = new EmailService();
