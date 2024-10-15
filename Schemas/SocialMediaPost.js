const mongoose = require("mongoose");

const SocialMediaPost = new mongoose.Schema(
    {
        social_media_source: String,
        hashtags: [String],
    },
    {timestamps: true}
);

module.exports = SocialMediaPost;
