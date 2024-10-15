const mongoose = require("mongoose");

const DataProvider = new mongoose.Schema(
    {
        data_provider: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
);

DataProvider.index({data_provider: 1}, {unique: true});

module.exports = DataProvider;
