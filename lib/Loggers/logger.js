const winston = require("winston");
const {combine, timestamp, printf, align, errors, json} = winston.format;
const {formatInTimeZone} = require("date-fns-tz");

const timeZone = "Europe/Rome";

const errorFilter = winston.format((info, opts) => {
    return info.level === "error" ? info : false;
});

const infoFilter = winston.format((info, opts) => {
    return info.level === "info" ? info : false;
});

const options = {
    levels: winston.config.syslog.levels,
    level: process.env.LOG_LEVEL || "info",
    defaultMeta: {
        service: "Collector",
    },
    format: combine(
        errors({stack: true}),
        timestamp({
            format: () =>
                formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd HH:mm:ssXXX"),
        }),
        json(),
        printf(
            (msg) => {
                const pid = `<PID:${process.pid}>`
                const service = `<${msg.service}>`
                const level = `${msg.level}`
                return `[${msg.timestamp}] ${pid} ${service} ${level}: ${msg.message}`
            }
        )
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            dirname: "logs",
            filename: "/logs/combined.log",
        }),
        new winston.transports.File({
            filename: "/logs/app-error.log",
            dirname: "logs",
            level: "error",
            format: combine(errorFilter(), timestamp(), json()),
        }),
        new winston.transports.File({
            filename: "/logs/app-info.log",
            dirname: "logs",
            level: "info",
            format: combine(infoFilter(), timestamp(), json()),
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            dirname: "logs",
            filename: "/logs/exception.log",
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            dirname: "logs",
            filename: "/logs/rejections.log",
        }),
    ],
};

winston.loggers.add("Server", {
    ...options,
    defaultMeta: {service: "Server"},
});

winston.loggers.add("Collector", {
    ...options,
    defaultMeta: {service: "Collector"},
});

winston.loggers.add("Database", {
    ...options,
    defaultMeta: {service: "Database"},
});

winston.loggers.add("MasterProcess", {
    ...options,
    defaultMeta: {service: "MasterProcess"},
});
