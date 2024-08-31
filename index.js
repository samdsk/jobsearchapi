require("dotenv").config();
require("./lib/logger");

const Logger = require("winston").loggers.get("Server");
const morgan = require("morgan");

const { db_connect, db_close } = require("./db/db");

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message) => Logger.info(message.trim()),
    },
  }
);

const express = require("express");
const server = express();

const api_route = require("./API/apiGateway");
const ErrorHandler = require("./Errors/ErrorHandler");

const PORT = process.env.PORT || 3000;

server.use(morganMiddleware);
server.use(express.json());

server.use("/api", api_route);

server.use(ErrorHandler);

const start = async () => {
  try {
    await db_connect(process.env.DB_PROD_URL);
    server.listen(PORT, () =>
      Logger.info(`Server is up and running at port: ${PORT}`)
    );
  } catch (error) {
    console.error(error);
  }
};

start();
