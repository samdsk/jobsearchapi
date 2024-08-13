require("dotenv").config();

const { db_connect, db_close } = require("./db/db");
const RapidAPIAutomator = require("./lib/Automators/RapidAPIAutomator");
const { logResultsToJSONFile } = require("./lib/resultsLogger");
const Logger = require("./lib/logger");

const CollectorEventEmitter = require("./lib/CollectorEventEmitter");
const { Scheduler, EVENT } = require("./lib/Scheduler");

const app = async () => {
  const schedulerExpression = "*/1 * * * *"; // every 1 minutes
  const keyset1 = new Set([
    "***REMOVED***",
  ]);

  const jobList1 = ["sviluppatore software"];

  const Emitter = new CollectorEventEmitter();

  Emitter.on(EVENT, wrapper.bind(null, keyset1, jobList1));

  const scheduler = new Scheduler(Emitter, schedulerExpression);

  scheduler.start();

  setTimeout(async () => {
    scheduler.stop();
    await db_connect();
    Logger.info("Exiting...");
  }, 1000 * 60 * 3 + 1000 * 20);
};

const wrapper = async (keySet, jobList) => {
  const automator = new RapidAPIAutomator(keySet);
  const response = await automator.collect(jobList);

  Logger.info("Logging results summary");
  await logResultsToJSONFile("summary", new Date(Date.now()), response);
  Logger.info(JSON.stringify(response));
};

async function start() {
  try {
    Logger.info("Starting...");
    await db_connect();
    await app();
  } catch (error) {
    await db_close();
    console.error(error);
    process.exit(1);
  }
}

start();
