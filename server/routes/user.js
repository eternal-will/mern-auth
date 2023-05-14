const router = require("express").Router();

const {
  createUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");

const { isResetTokenValid } = require("../middlewares/tokenValidator");
const {
  validateUser,
  validate,
  validateNewPassword,
} = require("../middlewares/validator");

router.post("/create", validateUser, validate, createUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password",
  isResetTokenValid,
  validateNewPassword,
  validate,
  resetPassword
);

module.exports = router;
