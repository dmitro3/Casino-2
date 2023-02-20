const mongoose = require("mongoose");

const nuggetSchema = mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
  },
);

const Nugget = mongoose.model("Nugget", nuggetSchema);

module.exports = Nugget;
