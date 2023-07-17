const express = require("express");
const cors = require("cors");
const passport = require("passport");
const expressSession = require("express-session");

require("dotenv").config();

require("./db");

const { initiatePassport } = require("./utils/passport");

const app = express();

const userRouter = require("./routes/user");
const quoteRouter = require("./routes/quote");
const authRouter = require("./routes/auth");

initiatePassport();

app.use(
  expressSession({
    secret: "topSecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/quote", quoteRouter);
app.use("/auth", authRouter);

app.listen(1377, () => {
  console.log("Server listening on port 1377");
});
