const mongoose = require("mongoose");

const raffleSchema = mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
);

const Raffle = mongoose.model("Raffle", raffleSchema);

module.exports = Raffle;



