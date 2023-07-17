const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

exports.initiatePassport = () => {
  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.G_CLIENT_ID,
          clientSecret: process.env.G_CLIENT_SECRET,
          callbackURL: "/auth/google/callback",
          scope: ["profile", "email"],
        },
        (accessToken, refreshToken, profile, callback) => {
          callback(null, profile);
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  } catch (error) {
    console.log("util.passport: " + error);
  }
};
