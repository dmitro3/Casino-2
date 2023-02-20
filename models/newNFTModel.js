const mongoose = require("mongoose");

const newNFTSchema = mongoose.Schema(
  {
    NFTAddress: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
);

const NewNFT = mongoose.model("NewNFT", newNFTSchema);

module.exports = NewNFT;
