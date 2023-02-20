const mongoose = require("mongoose");

const rewardSchema = mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
        type: Date,
        required: true
    }
  },
);

const Reward = mongoose.model("Reward", rewardSchema);

module.exports = Reward;
