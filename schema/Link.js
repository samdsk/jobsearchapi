const mongoose = require("mongoose");

const Link = new mongoose.Schema(
  {
    job_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "JobPost",
    },
    link_source: { type: String, required: true },
    link: { type: String, require: true },
  },
  { timestamps: true }
);

Link.index({ job_id: 1, link_source: 1 }, { unique: true });

module.exports = mongoose.model("Link", Link);
