const mongoose = require("mongoose");

const depositSchema = mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true
    },
    bettingAmount: {
      type: String,
      required: true
    },
    mineAmount: {
      type: Number,
      required: true
    },
    checked: {
      type: Boolean,
      required: true
    },
    currencyMode: {
      type: String,
      required: true
    }
  },
);

module.exports = Deposit = mongoose.model('Deposit', depositSchema);