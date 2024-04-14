const mongoose = require('mongoose');

const db_connect = async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb");
}

module.exports = {db_connect};