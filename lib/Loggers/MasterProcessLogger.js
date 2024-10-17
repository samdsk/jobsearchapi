const winston = require("winston");
const getOptions = require('./LogginOptions')

module.exports = winston.createLogger(getOptions("MasterProcess"));
