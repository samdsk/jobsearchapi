const Job = require("../schema/JobSchema");

const insertAllJobs = async (searchResults) => {
  const additionalDetails = {
    searchJobType: searchResults.jobType,
    searchLocation: searchResults.location,
    searchLanguage: searchResults.language,
    searchDate: searchResults.searchDate,
  };

  for (const job of searchResults.jobs) {
    await insertJob(job, additionalDetails);
  }
};

const insertJob = async (job, additionalDetails) => {
  const found = await Job.findById(job.id);

  if (!found) {
    job = setJobSchemaID(job);

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
  newJob._id = job.id;
  delete newJob.id;
  return newJob;
};

module.exports = {
  insertJob,
  insertAllJobs,
  setJobSchemaID,
};
