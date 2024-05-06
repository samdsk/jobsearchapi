const mongoose = require("mongoose");

// TODO: define inclusiveness types
const inclusiveness_types = ["none", "gender"];

const Inclusiveness = new mongoose.Schema(
  {
    description_id: { type: mongoose.Types.ObjectId, required: true },
    is_inclusive: { type: Boolean, required: true },
    type: { type: String, enum: inclusiveness_types },
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
