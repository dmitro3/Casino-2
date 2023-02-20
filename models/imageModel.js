const mongoose = require("mongoose");

const imageSchema = mongoose.Schema(
  {
    path: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
  },
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
