require("dotenv").config();
const mongoose = require("mongoose");
const pipeline = require("./finetune_pipeline");

const Logger = require("winston").loggers.get("Database");

const db_connect = async (DB_URL) => {
    const url = DB_URL || process.env.DB_URL;
    await mongoose.connect(url);

    await mongoose.connection.db.createCollection("outputllms", {
        viewOn: "annotations",
        pipeline: pipeline,
    });

    Logger.info(`DB @ ${url} connected.`);
};
const db_close = async () => {
    await mongoose.connection.close();
    Logger.info(`DB connection closed.`);
};

module.exports = {db_connect, db_close};
