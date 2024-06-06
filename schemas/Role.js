const mongoose = require("mongoose");

const Role = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true,
    },
    reliability_score: {
      type: Number,
      required: true,
      min: [0, "Min score is 0"],
      max: [10, "Max score is 10"],
    },
  },
  { timestamps: true }
);

module.exports = Role;
