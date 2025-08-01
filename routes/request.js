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
      if (!isUser) {
        return res.status(400).json({
          message: "User don't exist",
        });
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

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid Status type",
        });
      }

      const ConnectionRequest = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested"
      });

      if (!ConnectionRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }

      ConnectionRequest.status = status;
      const data = await ConnectionRequest.save();

      res.status(200).json({
        message: `Connection request ${status}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);
module.exports = requestRouter;
