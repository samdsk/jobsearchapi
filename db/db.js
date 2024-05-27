require("dotenv").config();
const mongoose = require("mongoose");
const pipeline = require("./finetune_pipeline");

const db_connect = async () => {
  await mongoose.connect(process.env.DB_URL);

  await mongoose.connection.db.createCollection("outputllms", {
    viewOn: "annotations",
    pipeline: pipeline,
  });
};
const db_close = async () => {
  await mongoose.connection.close();
};

module.exports = { db_connect, db_close };
