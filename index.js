require("dotenv").config();
const fs = require("fs");

const {collectJobsByType, collectAllJobTypes} = require('./lib/collector')

const getJobTypesFromFile = async (filename) => {
  const jobListString = await fs.promises.readFile(filename, {
    encoding: "utf8",
    flag: "r",
  });

  const jobTypes = JSON.parse(jobListString).map((job) => job.toLowerCase());
  
  return jobTypes
}

const main = async () => {
  try {
    await collectJobsByType("TestJob")
  } catch (error) {
    console.error(error);
  }
};

main();
