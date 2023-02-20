const mongoose = require("mongoose");

const turtleHistorySchema = mongoose.Schema(
  {
    first: {
      type: Number,
      required: true
    },
    second: {
      type: Number,
      required: true
    },
    winMultiplier: {
      type: Number,
      required: true
    },
    quinellaMultiplier: {
      type: Number,
      required: true
    },
  },
);

const TurtleHistory = mongoose.model("TurtleHistory", turtleHistorySchema);

module.exports = TurtleHistory;
