const mongoose = require("mongoose");
const JobPost = require("../Models/JobPost");
const Annotator = require("../Models/Annotator");
const Label = require("../Models/Label");
const Domain = require("../Models/Domain");

const Annotation = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      ref: "JobPost",
    },
    annotator: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Annotator",
    },
    label: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Label",
    },
    reason: {
      type: String,
      required: true,
    },
    domain: {
      type: mongoose.Types.ObjectId,
      ref: "Domain",
    },
    tokens: {
      type: [String],
      required: true,
      validator: (v) => Array.isArray(v),
    },
  },
  { timestamps: true }
);

Annotation.index(
  { source: 1, annotator: 1, label: 1, domain: 1 },
  { unique: true }
);

Annotation.path("source").validate(async (value) => {
  return await JobPost.JobPost.exists({ _id: value });
}, "Invalid JobPost");

Annotation.path("annotator").validate(async (value) => {
  return await Annotator.Annotator.exists({ _id: value });
}, "Invalid Annotator");

Annotation.path("label").validate(async (value) => {
  return await Label.Label.exists({ _id: value });
}, "Invalid Label");

Annotation.path("domain").validate(async (value) => {
  return await Domain.Domain.exists({ _id: value });
}, "Invalid Domain");

module.exports = Annotation;
