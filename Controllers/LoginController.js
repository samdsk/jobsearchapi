require("dotenv").config();
const RequestError = require("../Errors/RequestError");
const {authenticateUser} = require("../Services/UserService");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const Logger = require("winston").loggers.get("Server");

const SECRET_KEY = process.env.SERVER_SECRET_KEY;
const SESSION_DURATION = process.env.SERVER_SESSION_DURATION || "3h";

const login = async (req, res, next) => {
    const email = req.body.email || "";
    const password = req.body.password || "";

    if (!email || !password)
        return next(new RequestError("email and password fields are required"));

    if (!validator.isEmail(email))
        return res.sendStatus(401);

    try {
        const auth = await authenticateUser(email, password);
        if (!auth) {
            Logger.info(`Login failed : ${email}`);
            return res.sendStatus(401);
        }

        if (auth) {
            const token = generateToken(auth.email, auth.userType);
            Logger.info(`Login : ${email} - ${token}`);
            return res.json({
                success: true,
                token: token,
            })
        }

    } catch (error) {
        next(error);
    }
}

const generateToken = (email, userType) => {
    return jwt.sign({email: email, userType: userType}, SECRET_KEY, {expiresIn: SESSION_DURATION})
}

module.exports = {login}