const mongoose = require("mongoose");

const CascadeDelete = require("../lib/db_utils");

// TODO: cascade deletes to Annotation
const Domain = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

Domain.pre("deleteOne", { document: true, query: false }, async function () {
  const id = this._id;
  await CascadeDelete.cascadeDeleteAnnotations({ domain: id });
});

Domain.pre("deleteOne", { document: false, query: true }, async function () {
  const id = this.getFilter()["_id"];

  if (!id) throw new Error("usage: Domain.deleteOne({_id:id})");

  await CascadeDelete.cascadeDeleteAnnotations({ domain: id });
});

module.exports.Domain = mongoose.model("Domain", Domain);
