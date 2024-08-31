class RequestError extends Error {
  constructor(message, statusCode) {
    super(`Bad Request - Message: ${message}`);
    this.statusCode = statusCode;
  }
}

module.exports = RequestError;
