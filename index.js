const {fork} = require('child_process')

const Logger = require("./lib/Loggers/MasterProcessLogger")

const SERVER = './server'
const COLLECTOR = './collector'

const start = async () => {
    Logger.info(`Started MasterProcess with pid ${process.ppid}`);

    const process_collector = fork(COLLECTOR);
    Logger.info(`Process Collector started with pid ${process_collector.pid}`)

    const process_server = fork(SERVER);
    Logger.info(`Process Server started with pid ${process_server.pid}`)

    process_collector.on('message', (msg) => {
        Logger.info(`Received message from COLLECTOR <${process_collector.pid}> : ${msg.to}:${msg.code}`);
        process_server.send(msg);
    })

    process_server.on('message', (msg) => {
        Logger.info(`Received message from SERVER <${process_server.pid}> : ${msg.to}:${msg.code}`);
        process_collector.send(msg);
    })
};

(() => {
    try {
        start();
    } catch (e) {
        Logger.error(e)
    }

})()
