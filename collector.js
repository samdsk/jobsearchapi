require("dotenv").config();

const {db_connect, db_close} = require("./db/db");
const RapidAPIAutomator = require("./lib/Automators/RapidAPIAutomator");
const {logResultsToJSONFile} = require("./lib/resultsLogger");
const Logger = require("./lib/Loggers/CollectorLogger")

const CollectorEventEmitter = require("./lib/CollectorEventEmitter");
const {Scheduler, EVENT, API_TRIGGER, getNextSchedule} = require("./lib/Scheduler");
const {getJSONFromFile, getJobTypesFromFile} = require("./lib/utils");

const app = async () => {
    const schedulerExpression = getNextSchedule()

    const keys = await getJSONFromFile(process.env.KEYS_FILENAME);
    const keySet = new Set(keys);

    const jobList = await getJobTypesFromFile(process.env.JOBTYPES_FILENAME);

    const Emitter = new CollectorEventEmitter();

    Emitter.on(EVENT, wrapper.bind(null, keySet, jobList));

    const scheduler = new Scheduler(Emitter);
    scheduler.start(schedulerExpression);

    handle_api_trigger(scheduler);
    Logger.info("started successfully")

    setTimeout(async () => {
        scheduler.stop();
        await db_close();
        Logger.info("Exiting...");
    }, 1000 * 60 * 3 + 1000 * 20);
};

const wrapper = async (keySet, jobList) => {
    try {
        const automator = new RapidAPIAutomator(keySet);
        const response = await automator.collect(jobList);

        Logger.info("Logging results summary");
        await logResultsToJSONFile("summary", new Date(Date.now()), response);

        Logger.info(JSON.stringify(response));

    } catch (error) {
        Logger.info("Something wrong in wrapper")
        Logger.error(error.message)
    }
};

async function start() {
    try {
        Logger.info("Starting...");
        await db_connect(process.env.DB_PROD_URL);
        await app();
    } catch (error) {
        Logger.info("Something wrong in collector start")
        Logger.error(error.message)
        await db_close();
        process.exit(1);
    }
}

const handle_api_trigger = (scheduler) => {
    process.on("message", (msg) => {
        if (msg.to === "COLLECTOR" && msg.code === API_TRIGGER) {
            Logger.info("API trigger received.")
            scheduler.emit(getNextSchedule())
            return process.send({to: "SERVER", code: 200})
        }
    })
}

start();