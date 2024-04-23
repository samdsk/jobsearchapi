const Job = require("../schema/JobSchema");
const { generateHash } = require("./generateID");

const insertAllJobs = async (searchResults) => {
  const additionalDetails = {
    searchJobType: searchResults.jobType,
    searchLocation: searchResults.location,
    searchLanguage: searchResults.language,
    searchDate: searchResults.searchDate,
  };
  let count = 0;

  for (const job of searchResults.jobs) {
    const res = await insertJob(job, additionalDetails);
    if (res) count++;
  }

  return count;
};

const insertJob = async (job, additionalDetails) => {
  job = setJobSchemaID(job);
  const found = await Job.findById(job._id);

  if (!found) {
    job.searchDate = additionalDetails.searchDate;
    job.searchJobType = additionalDetails.searchJobType;
    job.searchLocation = additionalDetails.searchLocation;
    job.searchLanguage = additionalDetails.searchLanguage;

    const createdJob = await Job.create(job);
    return createdJob;
  } else {
    return null;
  }
};

const setJobSchemaID = (job) => {
  const newJob = { ...job };
  newJob._id = generateHash(job);
  return newJob;
};

module.exports = {
  insertJob,
  insertAllJobs,
  setJobSchemaID,
};
