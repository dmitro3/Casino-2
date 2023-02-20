const mongoose = require("mongoose");

const historySchema = mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true
    },
    game: {
      type: String,
      required: true
    },
    player: {
      type: String,
      required: true
    },
    wager: {
      type: String,
      required: true
    },
    payout: {
      type: Number,
      required: true
    },
    coin: {
      type: Number,
      required: true
    },
    mine: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    currencyMode: {
      type: String,
      required: true
    }
  },
);

const History = mongoose.model("History", historySchema);

module.exports = History;
