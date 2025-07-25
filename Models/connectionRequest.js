const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enums: {
      values: ["ignore", "interested", "accepted", "rejected"],
      message: `{VALUE} is incorrect status type`,
    },
  },
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  // Check if from and to User id is same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection req to yourself");
  }

  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
