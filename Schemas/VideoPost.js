const mongoose = require("mongoose");

const VideoPost = new mongoose.Schema(
    {
        video_source: String,
    },
    {timestamps: true}
);

module.exports = VideoPost;
