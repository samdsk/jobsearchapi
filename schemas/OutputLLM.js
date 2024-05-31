const mongoose = require("mongoose");

const OutputLLM = new mongoose.Schema(
  {
    source: String,
    label: String,
    domain: String,
    description: String,
    reason: String,
    tokens: [String],
  },
  { timestamps: true, autoCreate: false, autoIndex: false }
);

module.exports = mongoose.model("OutputLLM", OutputLLM);
