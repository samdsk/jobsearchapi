const winston = require("winston");
const { combine, timestamp, printf, align, errors, json } = winston.format;

const errorFilter = winston.format((info, opts) => {
  return info.level === "error" ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === "info" ? info : false;
});

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    errors({ stack: true }),
    timestamp(),
    json(),
    printf((msg) => `[${msg.timestamp}] ${msg.level}: ${msg.message}`)
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
});

module.exports = logger;
