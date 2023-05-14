const { check, validationResult } = require("express-validator");

exports.validateUser = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is missing!")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be 3 to 20 characters long"),

  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email address"),

  check("password").isStrongPassword().withMessage("Password is not strong"),
];

exports.validateNewPassword = [
  check("password").isStrongPassword().withMessage("Password is not strong"),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }
  next();
};
