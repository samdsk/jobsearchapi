const mongoose = require("mongoose");

// TODO: define annotation types
const annotation_types = ["type1", "type2"];

const Annotation = new mongoose.Schema(
  {
    job_post_id: {
      type: String,
      required: true,
      ref: "JobPost",
    },
    type: { type: String, required: true, enum: annotation_types },
    text: { type: String, required: true },
    source: { type: String, require: true },
    reliability_score: {
      type: Number,
      min: [0, "Min score is 0"],
      max: [5, "Max score is 5"],
    },
    index_start: { type: Number, required: true },
    index_end: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Annotation", Annotation);
