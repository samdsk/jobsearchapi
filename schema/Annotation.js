const mongoose = require("mongoose");

const annotation_types = ["positive", "negative"];

const Annotation = new mongoose.Schema(
  {
    description_id: { type: mongoose.Types.ObjectId, required: true },
    inclusiveness_id: { type: mongoose.Types.ObjectId, required: true },
    annotation_type: { type: String, required: true, enum: annotation_types },
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

module.exports = mongoose.model("Inclusiveness", Annotation);
