const mongoose = require("mongoose");

const { isEmail } = require("validator");

const Role = require("./Role");
const Background = require("./Background");

const { cascadeDeleteAnnotations } = require("../lib/db_utils");

const Annotator = new mongoose.Schema(
  {
    role: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Role",
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail, "Invalid Email"],
    },
    background: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Background",
    },
  },
  { timestamps: true }
);

Annotator.index({ role: 1, email: 1 }, { unique: true });

Annotator.path("role").validate(async (value) => {
  return await Role.Role.exists({ _id: value });
}, "Invalid Role");

Annotator.path("background").validate(async (value) => {
  return await Background.Background.exists({ _id: value });
}, "Invalid Background");

Annotator.pre("deleteOne", { document: true, query: false }, async function () {
  const id = this._id;
  await cascadeDeleteAnnotations({ annotator: id });
});

Annotator.pre("deleteOne", { document: false, query: true }, async function () {
  const id = this.getFilter()["_id"];

  if (!id) throw new Error("usage: Annotator.deleteOne({_id:id})");

  await cascadeDeleteAnnotations({ annotator: id });
});

module.exports.Annotator = mongoose.model("Annotator", Annotator);
