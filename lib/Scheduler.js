const schedule = require("node-schedule");
const Logger = require("winston").loggers.get("Collector");
const EVENT = "collect";

class Scheduler {
    /**
     *
     * @param {EventEmmitter} emitter
     * @param {Expression} nodeScheduleExp Node-Scheduler Expression
     */
    constructor(emitter, nodeScheduleExp) {
        this.eventEmitter = emitter;
        this.scheduleExp = nodeScheduleExp;
        this.task = null;
    }

    start() {
        if (!this.task) {
            this.task = schedule.scheduleJob(this.scheduleExp, () => {
                Logger.info(`Scheduler: event emit: ${EVENT}`);
                this.eventEmitter.emit(EVENT);
            });
            Logger.info("Scheduler started.");
        } else {
            Logger.info("Scheduler is already running!");
        }
    }

    stop() {
        if (this.task) {
            this.task.cancel();
            this.task = null;
            console.log("Scheduler stopped!");
        }
    }
}

module.exports = {Scheduler, EVENT};
