const mongoose = require("mongoose");
const Annotation = require("./Annotation");
const Link = require("./Link");

const { cascadeDeleteAnnotations } = require("../lib/db_utils");

const JobPost = new mongoose.Schema(
  {
    _id: { type: String },
    job_type: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    employment_type: { type: String, default: "" },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

JobPost.pre("deleteOne", { document: true, query: false }, async function () {
  const id = this._id;
  const filter = { source: id };

  await cascadeDeleteAnnotations(filter);
  await Annotation.Annotation.deleteMany(filter);
  await Link.Link.deleteMany({ job_post: id });
});

JobPost.pre("deleteOne", { document: false, query: true }, async function () {
  const id = this.getFilter()["_id"];

  if (!id) throw new Error("usage: JobPost.deleteOne({_id:id})");

  const filter = { source: id };

  await cascadeDeleteAnnotations(filter);
  await Link.Link.deleteMany({ job_post: id });
});

module.exports.JobPost = mongoose.model("JobPost", JobPost);
