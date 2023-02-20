const mongoose = require("mongoose");

const popupSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
  },
);

const Popup = mongoose.model("Popup", popupSchema);

module.exports = Popup;



