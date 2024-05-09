const mongoose = require("mongoose");

const Description = new mongoose.Schema(
  {
    job_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      unique: true,
      ref: "JobPost",
    },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

Description.index({ job_id: 1 }, { unique: true });

module.exports = mongoose.model("Description", Description);
