const mongoose = require("mongoose");
const Annotation = require("./Annotation");

const Token = new mongoose.Schema(
  {
    annotation: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Annotation",
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

Token.path("annotation").validate(async (value) => {
  return await Annotation.Annotation.exists({ _id: value });
}, "Invalid Annotation");

module.exports.Token = mongoose.model("Token", Token);
