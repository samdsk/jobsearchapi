const mongoose = require("mongoose");

const CascadeDelete = require("../lib/db_utils");

const Label = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

Label.pre("deleteOne", { document: true, query: false }, async function () {
  const id = this._id;
  await CascadeDelete.cascadeDeleteAnnotations({ label: id });
});

Label.pre("deleteOne", { document: false, query: true }, async function () {
  const id = this.getFilter()["_id"];

  if (!id) throw new Error("usage: Label.deleteOne({_id:id})");

  await CascadeDelete.cascadeDeleteAnnotations({ label: id });
});

module.exports.Label = mongoose.model("Label", Label);
