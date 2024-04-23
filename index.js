require("dotenv").config();

const { db_connect, db_close } = require("./db/db");
const Utils = require("./lib/utils");
const Automate = require("./lib/automate");
const { logResultsToJSONFile } = require("./lib/resultsLogger");

const main = async () => {
  try {
    const filename_jobtypes = process.argv[2] || "jobtypeslist.json";
    console.log(`Reading job types file : ${filename_jobtypes}`);
    const jobs = await Utils.getJobTypesFromFile(filename_jobtypes);

    const filename_keys = process.argv[3] || "keylist.json";
    console.log(`Reading key list file : ${filename_keys}`);
    const keys = await Utils.getJSONFromFile(filename_keys);

    const keySet = new Set(keys);
    const automate = new Automate(keySet);

    console.log("Starting...");
    await db_connect();
    const response = await automate.collect(jobs);

    console.log("Logging results summary");
    await logResultsToJSONFile("summary", new Date(Date.now()), response);

    console.log(response);

    await db_close();
    console.log("Exiting...");

    process.exit();
  } catch (error) {
    await db_close();
    console.error(error);
    process.exit(1);
  }
};

main();
