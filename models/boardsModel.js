const mongoose = require("mongoose");

const boardsSchema = mongoose.Schema(
  {
    walletAddress:{
      type: String,
      required: true
    },
    boardClickedString: {
      type: String,
      required: true
    },
    boardString: {
      type: String,
      required: true
    },
    mineAmount: {
      type: Number,
      required: true
    },
    bettingAmount: {
      type: Number,
      required: true
    },
    houseEdge: {
      type: Number,
      required: true
    },
    currencyMode: {
      type: String,
      required: true
    },
    fail: {
      type: Boolean,
      default: false
    },
  },
);

const Boards = mongoose.model("Board", boardsSchema);

module.exports = Boards;
