const JobSchema = require("./schema/JobSchema");

const insertAllJobs = async (jobs) => {
  for (const job of jobs) {
    await insertJob(job);
  }
};

const insertJob = async (job) => {
  const found = await JobSchema.findById(job.id);

  if (!found) {
    job = setJobSchemaID(job);
    const jobProviders = [];

    for (const jp of job.jobProviders) {
      jobProviders.push(jp);
    }

    job.jobProviders = jobProviders;

    const createdJob = await JobSchema.create(job);
    console.log(createdJob);
  } else {
    console.log("found:", found);
  }
};

const setJobSchemaID = (job) => {
  job._id = job.id;
  delete job.id;
  return job;
};

module.exports = {
  insertJob,
  insertAllJobs,
  setJobSchemaID,
};
