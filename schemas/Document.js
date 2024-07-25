const mongoose = require("mongoose");

const Document = new mongoose.Schema(
  {
    document_type: String,
    section: String,
    reference: [{ type: mongoose.Types.ObjectId, ref: "Document" }],
  },
  { timestamps: true }
);

module.exports = Document;
