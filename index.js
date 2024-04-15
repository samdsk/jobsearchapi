require("dotenv").config();
const fs = require("fs");
const { db_connect } = require("./db/db");

const { collectJobsByType, collectAllJobTypes } = require("./lib/collector");

const getJobTypesFromFile = async (filename) => {
  const jobListString = await fs.promises.readFile(filename, {
    encoding: "utf8",
    flag: "r",
  });

  const jobTypes = JSON.parse(jobListString).map((job) => job.toLowerCase());

  return jobTypes;
};

const getJobsFromFile = async (filename) => {
  const jobListString = await fs.promises.readFile(filename, {
    encoding: "utf8",
    flag: "r",
  });

  return JSON.parse(jobListString);
};

const main = async () => {
  try {
    await db_connect();
  } catch (error) {
    console.error(error);
  }
};

main();
