const mongoose = require("mongoose");

const { isURL } = require("validator");
const JobPost = require("./JobPost");

const Link = new mongoose.Schema(
  {
    job_post: {
      type: String,
      required: true,
      ref: "JobPost",
    },
    source: { type: String, required: true },
    url: { type: String, required: true, validate: [isURL, "Invalid URL"] },
  },
  { timestamps: true }
);

Link.index({ job_post: 1, source: 1 }, { unique: true });

Link.path("job_post").validate(async (value) => {
  return await JobPost.JobPost.exists({ _id: value });
}, "Invalid JobPost");

module.exports.Link = mongoose.model("Link", Link);
