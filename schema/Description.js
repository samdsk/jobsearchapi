const mongoose = require("mongoose");

const Description = new mongoose.Schema(
  {
    job_id: { type: mongoose.Types.ObjectId, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Description", Description);
