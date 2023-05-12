const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const verificationOTPSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

verificationOTPSchema.pre("save", async function (next) {
  if (this.isModified("otp")) {
    this.otp = await bcrypt.hash(this.otp, 10);
  }

  next();
});

verificationOTPSchema.methods.compareOTP = async function (OTP) {
  return await bcrypt.compare(OTP, this.otp);
};

module.exports = mongoose.model("VerificationOTP", verificationOTPSchema);
