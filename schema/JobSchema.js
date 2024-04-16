const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  _id: String,
  jobType: String,
  title: String,
  company: String,
  description: String,
  image: String,
  location: String,
  employmentType: String,
  timeAgoPosted: String,
  salaryRange: String,
  jobProviders: [{ jobProvider: String, url: String }],
  searchDate: Date,
  searchJobType: String,
  searchLocation: String,
  searchLanguage: String,
});

module.exports = mongoose.model("Job", jobSchema);
