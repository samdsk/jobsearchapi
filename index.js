require("dotenv").config();

const { db_connect, db_close } = require("./db/db");
const Utils = require("./lib/utils");
const Automate = require("./lib/automate");
const { logResultsToJSONFile } = require("./lib/resultsLogger");
const Logger = require("./lib/logger");
const Collector = require("./lib/collector");
const SearchRequestSender = require("./lib/searchRequestSender");
const JobPostController = require("./lib/Controllers/JobPostController");
const RapidAPIConverter = require("./lib/Converters/RapidAPIConverter");
const JobPostService = require("./lib/Services/JobPostService");

const automate = async () => {
  try {
    const filename_jobtypes = process.argv[2] || "jobtypeslist.json";
    Logger.info(`Reading job types file : ${filename_jobtypes}`);
    const jobTypes = await Utils.getJobTypesFromFile(filename_jobtypes);

    const filename_keys = process.argv[3] || "keylist.json";
    Logger.info(`Reading key list file : ${filename_keys}`);
    const keys = await Utils.getJSONFromFile(filename_keys);

    const keySet = new Set(keys);
    const automate = new Automate(keySet);

    Logger.info("Starting...");
    await db_connect();
    const response = await automate.collect(jobTypes);

    Logger.info("Logging results summary");
    await logResultsToJSONFile("summary", new Date(Date.now()), response);
    Logger.info(response);

    await db_close();
    Logger.info("Exiting...");

    process.exit();
  } catch (error) {
    await db_close();
    console.error(error);
    process.exit(1);
  }
};

const single = async () => {
  const sender = new SearchRequestSender();
  const controller = new JobPostController(RapidAPIConverter, JobPostService);
  const collector = new Collector(sender, controller);
  try {
    Logger.info("Starting...");

    await db_connect();
    const response = await collector.searchJobsByType("Software Engineer");
    Logger.debug(response);
    await db_close();
    Logger.info("Exiting...");
  } catch (err) {
    Logger.debug(err);
    process.exit(1);
  }
};

single();
