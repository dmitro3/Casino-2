const mongoose = require("mongoose");

const transactionHistorySchema = mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    transaction: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now()
    },
  },
);

const THistory = mongoose.model("THistory", transactionHistorySchema);

module.exports = THistory;
