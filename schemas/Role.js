const mongoose = require("mongoose");

const CascadeDelete = require("../db/db_utils");

const Role = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true,
    },
    reliability_score: {
      type: Number,
      required: true,
      min: [0, "Min score is 0"],
      max: [10, "Max score is 10"],
    },
  },
  { timestamps: true }
);

Role.pre("deleteOne", { document: true, query: false }, async function () {
  const id = this._id;
  await CascadeDelete.cascadeDeleteAnnotators({ role: id });
});

Role.pre("deleteOne", { document: false, query: true }, async function () {
  const id = this.getFilter()["_id"];

  if (!id) throw new Error("usage: Role.deleteOne({_id:id})");
  await CascadeDelete.cascadeDeleteAnnotators({ role: id });
});

module.exports.Role = mongoose.model("Role", Role);
