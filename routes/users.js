const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../Models/connectionRequest");

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate(
        "fromUserId",
        "firstName lastName photoUrl about skills gender age"
      );

    res.status(200).json({
      message: "All requests",
      data: requests,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate(
        "fromUserId",
        "firstName lastName photoUrl about skills gender age"
      )
      .populate(
        "toUserId",
        "firstName lastName photoUrl about skills gender age"
      );

    const data = connections.map((row) => {
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
            return row.toUserId;
        }

        return row.fromUserId
    });

    res.status(200).json({
      data
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = userRouter;
