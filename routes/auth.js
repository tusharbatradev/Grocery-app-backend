const express = require("express");
const authRouter = express.Router();
const { validateSignUp } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../Models/users");

// Skills validator
function checkSkills(skills) {
  return skills.length > 3 ? false : true;
}

// Signup User
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    validateSignUp(req);

    // Encrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating new instance
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    if (!checkSkills(user.skills)) {
      throw new Error("Cannot add skills more than 3");
    }
    await user.save();
    res.status(200).send("User Added Successfully" + user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Login User
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Succesfull!");
    } else {
      res.status(400).send("Password is incorrect");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err);
  }
});

// Logout User
authRouter.post('/logout', async (req, res) => {
    res.cookie("token", null, {
        expires : new Date(Date.now())
    });
    res.send("Logout Successful!")
})

module.exports = authRouter
