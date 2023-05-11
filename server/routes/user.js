const router = require("express").Router();

const { createUser, loginUser } = require("../controllers/user");
const { validateUser, validate } = require("../middlewares/validator");

router.post("/create", validateUser, validate, createUser);
router.post("/login", loginUser);

module.exports = router;
