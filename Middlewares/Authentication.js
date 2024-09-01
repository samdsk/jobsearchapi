const jwt = require("jsonwebtoken");
const Logger = require("winston").loggers.get("Server");

const SECRET_KEY = process.env.SERVER_SECRET_KEY;

const authentication = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        Logger.info(`Authentication failed : missing authorization header`);
        return res.sendStatus(401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        Logger.info(`Authentication failed : missing token`);
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.sendStatus(403);

        req.email = decoded.email;
        req.userType = decoded.userType;
        Logger.info(`Authenticated : ${decoded.email} - ${decoded.userType}`);

        next()
    })
}

const roleAuthentication = (...roles) => (req, res, next) => {
    if (!roles.includes(req.userType)) {
        Logger.info(`Role Authentication failed: ${req.userType} - ${req.method} : ${req.originalUrl}`);
        return res.status(403).json({success: false, error: "Access denied: Insufficient permissions"});
    }

    Logger.info(`Role Authenticated : ${req.userType} - ${req.method} : ${req.originalUrl}`);
    next()
}

const AdminLevel = ['Admin']
const AnnotationServiceLevel = ['AnnotationService', ...AdminLevel]
const LLMLevel = ['LLM', ...AnnotationServiceLevel]

const ROLES = {
    LLM: LLMLevel,
    AnnotationService: AnnotationServiceLevel,
    Admin: AdminLevel
}

module.exports = {authentication, roleAuthentication, ROLES}