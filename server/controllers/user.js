const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const VerificationOTP = require("../models/verificationOTP.model");

const { generateOTP, maitTransport } = require("../utils/mail");

exports.createUser = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const OTP = generateOTP();

    const verificationOTP = new VerificationOTP({
      owner: user._id,
      otp: OTP,
    });

    await verificationOTP.save();
    await user.save();

    maitTransport().sendMail({
      from: "otpverification@email.com",
      to: user.email,
      subject: "Email Verification",
      html: `<h1>OTP: ${OTP}</h1>`,
    });

    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    const isPasswordCorrect = await user.comparePassword(req.body.password);

    if (isPasswordCorrect) {
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
      return res.json({ status: "error", user: false });
    }
  } catch (error) {
    return res.json({ status: "error", error: error });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    const token = await VerificationOTP.findOne({ owner: userId });

    const isAccepted = await token.compareOTP(otp);

    if (isAccepted) {
      user.isVerified = true;

      await user.save();
      await VerificationOTP.findByIdAndDelete(token._id);

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
    return res.json({ status: "error", error: error });
  }
};
