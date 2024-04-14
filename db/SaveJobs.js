const JobSchema = require("./schema/JobSchema");

export const saveJobs = async (jobs) => {
  for (const job of jobs) {
    await saveJob(job);
  }
};

export const saveJob = async (job) => {
  const found = await JobSchema.findById(job.id);

  if (!found) {
    job._id = job.id;
    delete job.id;
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
