const mongoose = require("mongoose");

const Domain = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = Domain;
