const Job = require("../schema/JobSchema");
const { generateHash } = require("./generateID");

const insertAllJobs = async (data) => {
  const additionalDetails = {
    searchJobType: data.jobType,
    searchLocation: data.location,
    searchLanguage: data.language,
    searchDate: data.searchDate,
  };
  let count = 0;

  for (const job of data.jobs) {
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
