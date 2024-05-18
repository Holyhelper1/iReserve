const { verify } = require("../helpers/token");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  const tokenData = verify(req.cookies.token);

  const user = await User.findOne({ _id: tokenData.id });

  if (!user) {
    res.send({ error: "Authenticated user not found" });
    return;
  }
  req.user = user;
  next();
};
