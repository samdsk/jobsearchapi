const Job = require("../schema/JobSchema");

const insertAllJobs = async (jobs, jobType) => {
  for (const job of jobs) {
    await insertJob(job, jobType);
  }
};

const insertJob = async (job, jobType) => {
  const found = await Job.findById(job.id);

  if (!found) {
    job = setJobSchemaID(job);
    const jobProviders = [];

    for (const jp of job.jobProviders) {
      jobProviders.push(jp);
    }

    job.jobProviders = jobProviders;
    job.searchJobType = jobType;

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
