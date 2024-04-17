require("dotenv").config();

const { db_connect, db_close } = require("./db/db");
const SearchRequestSender = require("./lib/searchRequestSender");
const Collector = require("./lib/collector");

const Utils = require("./lib/utils");
const { logResultsToJSONFile } = require("./lib/resultsLogger");

const main = async () => {
  try {
    await db_connect();
    const filename = "./newJobTypesList.json";
    const jobs = await Utils.getJobTypesFromFile(filename);

    const sender = new SearchRequestSender();
    const collector = new Collector(sender);
    const response = await collector.searchJobTypeList(jobs);
    await logResultsToJSONFile("joblist_log", new Date(Date.now()), response);

    console.log(response);

    await db_close();
    process.exit();
  } catch (error) {
    if (error.response) {
      console.error("Request Error");
      console.error(error.response);
      await logResultsToJSONFile("error_log", new Date(Date.now()), error);
    } else {
      console.error(error);
    }

    await db_close();
    process.exit(1);
  }
};

main();
