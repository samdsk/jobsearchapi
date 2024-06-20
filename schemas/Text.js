const mongoose = require("mongoose");
const { isURL } = require("validator");
const DataProvider = require("../Models/DataProvider");
const Language = require("../Models/Language");

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

const Text = new mongoose.Schema(
  {
    _id: { type: String },
    title: { type: String, required: true },
    text: { type: String, required: true },
    data_provider: { type: mongoose.Types.ObjectId, required: true },
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
    language: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

Text.path("data_provider").validate(async (value) => {
  return await DataProvider.DataProvider.exists({ _id: value });
}, "Invalid Data Provider");

Text.path("language").validate(async (value) => {
  return await Language.Language.exists({ _id: value });
}, "Invalid Language");

module.exports = Text;
