const nodemailer = require("nodemailer");

exports.generateOTP = () => {
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += Math.floor(Math.random() * 10);
  }
  return OTP;
};

exports.maitTransport = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2a003376d8c14b",
      pass: "6bc8c505f529e7",
    },
  });
