const mongoose = require("mongoose");

const { isEmail } = require("validator");

const Role = require("../Models/Role");
const Background = require("../Models/Background");

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

Annotator.index({ email: 1 }, { unique: true });

Annotator.path("role").validate(async (value) => {
  return await Role.Role.exists({ _id: value });
}, "Invalid Role");

Annotator.path("background").validate(async (value) => {
  return await Background.Background.exists({ _id: value });
}, "Invalid Background");

module.exports = Annotator;
