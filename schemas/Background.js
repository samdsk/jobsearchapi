const mongoose = require("mongoose");

const CascadeDelete = require("../lib/db_utils");

const Background = new mongoose.Schema(
  {
    background: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

Background.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    const id = this._id;
    await CascadeDelete.cascadeDeleteAnnotators({ background: id });
  }
);

Background.pre(
  "deleteOne",
  { document: false, query: true },
  async function () {
    const id = this.getFilter()["_id"];

    if (!id) throw new Error("usage: Background.deleteOne({_id:id})");

    await CascadeDelete.cascadeDeleteAnnotators({ background: id });
  }
);

module.exports.Background = mongoose.model("Background", Background);
