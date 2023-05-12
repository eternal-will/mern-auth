const router = require("express").Router();

const { createUser, loginUser, verifyEmail } = require("../controllers/user");
const { validateUser, validate } = require("../middlewares/validator");

router.post("/create", validateUser, validate, createUser);
router.post("/login", loginUser);
router.post("/verifyEmail", verifyEmail);

module.exports = router;
