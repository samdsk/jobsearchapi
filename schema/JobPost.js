const mongoose = require("mongoose");

const JobPost = new mongoose.Schema(
  {
    _id: { type: String },
    job_type: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, default: "" },
    location: { type: String, required: true },
    employment_type: { type: String },
    description: { type: String, required: true },
    links: [
      {
        source: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobPost", JobPost);
