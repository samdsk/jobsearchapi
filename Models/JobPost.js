const mongoose = require("mongoose");

const JobPost = require("../Schemas/JobPost");

module.exports.JobPost = mongoose.model("JobPost", JobPost);
