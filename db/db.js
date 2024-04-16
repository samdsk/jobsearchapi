const mongoose = require("mongoose");

const db_connect = async () => {
  await mongoose.connect("mongodb://localhost:27017/testdb");
};
const db_close = async () => {
  await mongoose.connection.close();
};

module.exports = { db_connect, db_close };
