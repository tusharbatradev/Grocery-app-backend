const User = require("../Models/users");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");

    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User doesn't exist");
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(400).send("ERROR :" + err);
  }
};

module.exports = {
  userAuth,
};
