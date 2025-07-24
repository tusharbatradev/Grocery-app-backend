const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt")

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("User doesn't exist");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Cannot Edit the user");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    
    loggedInUser.save();
    res.status(200).json({
        message : `${loggedInUser.firstName}'s profile is updated`,
        data : loggedInUser
    })
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit/password",userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const newPassword = req.body.password;

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Not a strong password")
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashedPassword;
        await loggedInUser.save();
        res.status(200).json({
            message : `${loggedInUser.firstName}'s password is updated`
        })
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
      }
})

module.exports = profileRouter;
