const mongoose = require("mongoose");

const checkingSchema = mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true
    },
    cert: {
      type: String,
      required: true
    }
  },
);

const Checking = mongoose.model("Checking", checkingSchema);

module.exports = Checking;
