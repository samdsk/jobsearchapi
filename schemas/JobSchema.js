const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  _id: { type: String },
  id: { type: String, required: true }, // original job record's id (NOT unique)
  title: { type: String, required: true },
  company: String,
  description: { type: String, required: true },
  image: String,
  location: { type: String, required: true },
  employmentType: String,
  timeAgoPosted: String,
  salaryRange: String,
  jobProviders: [{ jobProvider: String, url: String }],
  searchDate: { type: Date, required: true, default: new Date(Date.now()) }, // search query executed date
  searchJobType: { type: String, required: true }, // search query job type
  searchLocation: { type: String, required: true }, // search query location
  searchLanguage: { type: String, required: true }, // search query language
});

module.exports = mongoose.model("Job", jobSchema);
