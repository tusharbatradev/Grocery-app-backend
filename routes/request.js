const express = require("express");
const connectionRequest = require("../Models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../Models/users");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;
      const status = req.params.status;

      // Status Validation
      const isAllowedStatus = ["interested", "ignored"];
      if (!isAllowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type",
        });
      }

      // Request Exist Validation
      const isExistingRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isExistingRequest) {
        return res.status(400).json({
          message: "Connection Request Already Exist",
        });
      }

      // Id validation
      const isUser = await User.findById(toUserId);
      if(!isUser){
        return res.status(400).json({
            message : "User don't exist"
        })
      }

      const ConnectionRequest = new connectionRequest({
        toUserId,
        fromUserId,
        status,
      });

      const data = await ConnectionRequest.save();

      res.json({
        message: `${req.user.firstName} is ${status} in ${isUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);


module.exports = requestRouter;
