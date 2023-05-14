const User = require("../models/user.model");
const ResetToken = require("../models/resetToken.model");

exports.isResetTokenValid = async (req, res, next) => {
  try {
    const { token, userId } = req.body;

    if (!token || !userId) throw new Error("Invalid request");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found!");

    const resetToken = await ResetToken.findOne({ owner: userId });
    if (!resetToken) throw new Error("Token expired!");

    if (!(await resetToken.compareToken(token)))
      throw new Error("Invalid token!");

    next();
  } catch (error) {
    res.json({ status: "error", error: error.toString() });
  }
};
