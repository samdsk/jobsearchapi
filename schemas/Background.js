const mongoose = require("mongoose");

const Background = new mongoose.Schema(
  {
    background: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = Background;
