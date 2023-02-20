const mongoose = require("mongoose");

const raffleWinnerSchema = mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
);

const RaffleWinner = mongoose.model("RaffleWinner", raffleWinnerSchema);

module.exports = RaffleWinner;



