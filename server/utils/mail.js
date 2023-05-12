const nodemailer = require("nodemailer");
require("dotenv").config();

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
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
