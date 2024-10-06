const {EVENT, API_TRIGGER} = require('../lib/Scheduler')
const Logger = require("winston").loggers.get("Server");

const triggerCollector = async (req, res) => {
    const collect = req.body.collect || "";
    let status = 400;
    if (collect === EVENT) {
        Logger.info("Triggering collector.")
        status = await sendTrigger({to: "COLLECTOR", code: API_TRIGGER});
        Logger.info("received collector response.")
        if (status.code === 200)
            return res.sendStatus(200);
        else
            return res.sendStatus(500);
    }

    return res.sendStatus(400);
}

const sendTrigger = async (msg) => {
    return new Promise((resolve, reject) => {
        process.once("message", (response) => {
            resolve(response)
        })

        process.send(msg)
    })
}

module.exports = {
    triggerCollector
}