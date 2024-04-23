const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  _id: String,
  id: String, // original job record's id (NOT unique)
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
  searchDate: Date, // search query executed date
  searchJobType: String, // search query job type
  searchLocation: String, // search query location
  searchLanguage: String, // search query language
});

module.exports = mongoose.model("Job", jobSchema);
