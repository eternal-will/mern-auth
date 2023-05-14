const jwt = require("jsonwebtoken");
const { check } = require("express-validator");

const User = require("../models/user.model");
const VerificationToken = require("../models/verificationToken.model");
const ResetToken = require("../models/resetToken.model");

const { generateToken, maitTransport } = require("../utils/mail");
const { createToken } = require("../utils/helper");

exports.createUser = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const token = generateToken();

    const verificationToken = new VerificationToken({
      owner: user._id,
      token: token,
    });

    await verificationToken.save();
    await user.save();

    maitTransport().sendMail({
      from: "otpverification@email.com",
      to: user.email,
      subject: "Email Verification",
      html: `<h1>OTP: ${token}</h1>`,
    });

    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: error.toString() });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) throw new Error("No user found with given email!");

    if (await user.comparePassword(req.body.password)) {
      jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        "secretkey", //store it in .env file in actual projects
        { expiresIn: "14d" }, //expires in 14 days
        (err, token) => {
          if (err) {
            return res.json({ status: "error", error: err });
          }

          return res.json({
            status: "ok",
            token: token,
          });
        }
      );
    } else {
      return res.json({
        status: "error",
        user: false,
        error: "Invalid email / password",
      });
    }
  } catch (error) {
    return res.json({ status: "error", error: error.toString() });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    const token = await VerificationToken.findOne({ owner: userId });

    if (await token.compareToken(otp)) {
      user.isVerified = true;

      await user.save();
      await VerificationToken.findByIdAndDelete(token._id);

      maitTransport().sendMail({
        from: "otpverification@email.com",
        to: user.email,
        subject: "Email Verified",
        html: `<h1>Email succesfully verified!</h1>`,
      });

      return res.json({ status: "ok" });
    } else {
      return res.json({ status: "error", error: "Invalid OTP" });
    }
  } catch (error) {
    return res.json({ status: "error", error: error.toString() });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) throw new Error("No user found with given email!");

    if (await ResetToken.findOne({ owner: user._id })) {
      return res.json({
        status: "error",
        error: "Wait for 5 mins before making another request!",
      });
    }

    const token = await createToken();

    const resetToken = new ResetToken({ owner: user._id, token: token });
    await resetToken.save();

    resetUrl = `http://localhost:3000/reset-password?token=${token}&userId=${user._id}`;

    maitTransport().sendMail({
      from: "passwordreset@email.com",
      to: user.email,
      subject: "Password Reset",
      html: `<a href="${resetUrl}">Click here to reset password</a>`,
    });

    res.json({
      status: "ok",
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    res.json({ status: "error", error: error.toString() });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found!");

    if (await user.comparePassword(password))
      throw new Error("New password can't be same as old one!");

    user.password = password;
    await user.save();

    await ResetToken.findOneAndDelete({ owner: user._id });

    maitTransport().sendMail({
      from: "passwordreset@email.com",
      to: user.email,
      subject: "Password Reset Successful",
      html: "<h1>Password reset successful!</h1>",
    });

    res.json({ status: "ok", message: "Password reset successful!" });
  } catch (error) {
    res.json({ status: "error", error: error.toString() });
  }
};
