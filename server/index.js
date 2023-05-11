const express = require("express");
const app = express();
const cors = require("cors");

require("./db");

const userRouter = require("./routes/user");
const quoteRouter = require("./routes/quote");

app.use(cors());

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/quote", quoteRouter);

app.listen(1377, () => {
  console.log("Server listening on port 1377");
});
