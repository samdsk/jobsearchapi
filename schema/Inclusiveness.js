const mongoose = require("mongoose");

// TODO: define inclusiveness types
const inclusiveness_types = ["none", "gender"];

const Inclusiveness = new mongoose.Schema(
  {
    job_post_id: {
      type: String,
      required: true,
      ref: "JobPost",
      index: { unique: true },
    },
    is_inclusive: { type: Boolean, required: true },
    type: { type: String, enum: inclusiveness_types, default: "none" },
    score: {
      type: Number,
      required: true,
      max: [5, "Max score is 5"],
      min: [0, "Min score is 0"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inclusiveness", Inclusiveness);
