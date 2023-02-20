const mongoose = require("mongoose");

const nftDepositSchema = mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true
    },
    nftName: {
      type: String,
      required: true
    },
  },
);

const NFTDeposit = mongoose.model("NFTDeposit", nftDepositSchema);

module.exports = NFTDeposit;
