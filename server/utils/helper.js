const crypto = require("crypto");

exports.createToken = () =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) reject(err);
      const token = buffer.toString("hex");
      resolve(token);
    });
  });
