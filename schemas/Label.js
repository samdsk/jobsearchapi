const mongoose = require("mongoose");

const Label = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = Label;
