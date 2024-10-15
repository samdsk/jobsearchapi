const mongoose = require("mongoose");

const Background = new mongoose.Schema(
    {
        background: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {timestamps: true}
);

Background.index({background: 1}, {unique: true});

module.exports = Background;
