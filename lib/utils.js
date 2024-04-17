const fs = require("fs").promises;

const getJobTypesFromFile = async (filename) => {
  const jobListString = await fs.readFile(filename, {
    encoding: "utf8",
    flag: "r",
  });

  const jobTypes = JSON.parse(jobListString).map((job) => job.toLowerCase());
  console.log(jobTypes);
  return jobTypes;
};

const getJobsFromFile = async (filename) => {
  const jobListString = await fs.readFile(filename, {
    flag: "r",
  });

  return JSON.parse(jobListString);
};

const contains = async (job, list) => {
  return list.includes(job);
};

const saveJobTypes = async (filename, list) => {
  try {
    await fs.writeFile(filename, JSON.stringify(list), { encoding: "utf8" });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  saveJobTypes,
  getJobTypesFromFile,
  getJobsFromFile,
  contains,
};
