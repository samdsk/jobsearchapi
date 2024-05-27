const mongoose = require("mongoose");
const { isURL } = require("validator");
const { cascadeDeleteAnnotations } = require("../lib/db_utils");

function links_validator(links) {
  const set = new Set();

  for (const link of links) {
    if (!link.source)
      return Promise.reject(new Error(`Link source is required!`));
    if (set.has(link.source))
      return Promise.reject(
        new Error(`Duplicate link source '${link.source}'`)
      );

    if (!isURL(link.url))
      return Promise.reject(new Error(`Invalid link url '${link.url}'`));
    set.add(link.source);
  }

  return true;
}

const JobPost = new mongoose.Schema(
  {
    _id: { type: String },
    job_type: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    employment_type: { type: String, default: "" },
    description: { type: String, required: true },
    links: {
      type: [
        {
          source: { type: String, required: true },
          url: {
            type: String,
          },
        },
      ],
      validate: {
        validator: links_validator,
      },
    },
  },
  { timestamps: true }
);

JobPost.pre("deleteOne", { document: true, query: false }, async function () {
  const id = this._id;
  const filter = { source: id };

  await cascadeDeleteAnnotations(filter);
});

JobPost.pre("deleteOne", { document: false, query: true }, async function () {
  const id = this.getFilter()["_id"];

  if (!id) throw new Error("usage: JobPost.deleteOne({_id:id})");

  const filter = { source: id };

  await cascadeDeleteAnnotations(filter);
});

module.exports.JobPost = mongoose.model("JobPost", JobPost);
