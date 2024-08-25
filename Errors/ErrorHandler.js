const ValidationError = require("./ValidationError");
const RequestError = require("./RequestError");
const MongooseValidationError = require("../Errors/MongooseValidationError");

const {default: mongoose} = require("mongoose");
const Logger = require("winston").loggers.get("Server");

const ErrorHandler = (err, req, res, next) => {
    if (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            err = new MongooseValidationError(err.message);
        }

        if (err instanceof mongoose.Error.CastError) {
            err = new RequestError(
                `Invalid value for '${err.path}' = '${err.value}'`,
                400
            );
        }

        if (err.code === 11000)
            err = new RequestError(
                `Possible duplication detected`,
                400
            );

        Logger.error(err.stack);

        res.status(err.statusCode || 500);

        if (err.statusCode) {
            return res.json({
                success: false,
                error: err.message,
            });
        }

        return res.json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

module.exports = ErrorHandler;
