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

module.exports = mongoose.Model("ConnectionRequest", connectionRequestSchema);
