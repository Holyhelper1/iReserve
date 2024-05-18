const jwt = require("jsonwebtoken");

const sign = process.env.JWT_SECRET;

module.exports = {
  generate(data) {
    return jwt.sign(data, sign, { expiresIn: "30d" });
  },
  verify(token) {
    if (!token) {
      throw new Error("No token provided");
    }
    try {
      return jwt.verify(token, sign);
    } catch (e) {
      throw new Error("Invalid or expired token");
    }
  },
};
