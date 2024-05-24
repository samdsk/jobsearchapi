const mongoose = require("mongoose");
const JobPost = require("./JobPost");
const Annotator = require("./Annotator");
const Label = require("./Label");
const Domain = require("./Domain");
const Token = require("./Token");

// TODO: change _id on diagram

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

Annotation.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    const id = this._id;
    await Token.Token.deleteMany({ annotation: id });
  }
);

Annotation.pre(
  "deleteOne",
  { document: false, query: true },
  async function () {
    const id = this.getFilter()["_id"];

    if (!id) throw new Error("usage: Annotation.deleteOne({_id:id})");
    await Token.Token.deleteMany({ annotation: id });
  }
);

module.exports.Annotation = mongoose.model("Annotation", Annotation);
