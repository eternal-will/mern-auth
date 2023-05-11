const router = require("express").Router();

const { getQuote, updateQuote } = require("../controllers/quote");

router.get("/", getQuote);
router.post("/", updateQuote);

module.exports = router;
