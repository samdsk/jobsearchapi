const mongoose = require("mongoose");

const JobPost = new mongoose.Schema(
  {
    description_id: { type: mongoose.Types.ObjectId, required: true },
    job_type: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, default: "" },
    location: { type: String, required: true },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobPost", JobPost);
