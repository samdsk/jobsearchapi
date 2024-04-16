require("dotenv").config();
const fs = require("fs");
const { db_connect, db_close } = require("./db/db");
const SearchRequestSender = require("./lib/searchRequestSender");

const { collectJobsByType, collectAllJobTypes } = require("./lib/collector");
const Collector = require("./lib/collector");

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
    // const sender = new SearchRequestSender();
    // const collector = new Collector(sender);

    // const response = await collector.searchJobsByType("Segretaria");
    // console.log(response);
    await db_close();

    process.exit();
  } catch (error) {
    console.error(error);
  }
};

main();
