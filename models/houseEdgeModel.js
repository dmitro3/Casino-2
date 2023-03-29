const mongoose = require("mongoose");

const houseEdgeSchema = mongoose.Schema(
  {
    mineHouseEdge: {
      type: Number,
      default: 0.92
    },
    doubleHouseEdge: {
      type: Number,
      default: 1
    },
    turtleHouseEdge: {
      type: Number,
      default: 0.75
    },
    quinellaHouseEdge: {
      type: Number,
      default: 0.37
    },
    crashTime: {
      type: Number,
      default: 5
    },
    minMine: {
      type: Number,
      default: 5
    },
    maxMine: {
      type: Number,
      default: 24
    },
    autoPayout: {
      type: String,
      default: "auto"
    },
    raffleOn: {
      type: Boolean,
      default: false
    },
    startTurtle: {
      type: Boolean,
      default: false
    },
    turtleFirst: {
      type: Number,
      default: 1
    },
    turtleSecond: {
      type: Number,
      default: 1
    },
    raffleDate: {
      type: Date,
      default: Date.now()
    },
    remainedNFT: {
      type: Number,
      default: 0
    },
    remainedTime1: {
      type: Number,
      default: 0
    },
    remainedTime2: {
      type: Number,
      default: 0
    },
    enableMines: {
      type: Boolean,
      default: true
    },
    enableDouble: {
      type: Boolean,
      default: true
    },
    enableLoot: {
      type: Boolean,
      default: true
    },
    enableTurtle: {
      type: Boolean,
      default: true
    },
  },
);

const HouseEdge = mongoose.model("HouseEdge", houseEdgeSchema);

module.exports = HouseEdge;