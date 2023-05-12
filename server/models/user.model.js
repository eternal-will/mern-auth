const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    quote: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { collection: "user-data" }
);

User.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

User.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("UserData", User);
