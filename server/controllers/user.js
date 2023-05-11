const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

exports.createUser = async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: error });
  }
};

exports.loginUser = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordCorrect) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secretkey"
    );

    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
};
