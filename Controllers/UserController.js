const RequestError = require("../Errors/RequestError");
const UserService = require("../Services/UserService");
const validator = require("validator");
const USER_TYPES = require("../Models/User").USER_TYPES;

const createUser = async (req, res, next) => {

    const email = req.body.email || "";
    const password = req.body.password || "";
    const passwordConfirm = req.body.passwordConfirm || "";


    if (!email || !password || !passwordConfirm) {
        return next(new RequestError("email, password and passwordConfirm fields are required!"));
    }

    if (!validator.isEmail(email))
        return next(new RequestError("invalid email"));

    if (password.length < 6)
        return next(new RequestError("password must be at least 6 characters!"));

    if (password !== passwordConfirm)
        return next(new RequestError("password and passwordConfirm don't match!"));

    try {
        const result = await UserService.createSimpleUser(email, password);
        if (!result) return next(new RequestError("User already exists!"));
        return res.json({success: true});
    } catch (error) {
        next(error)
    }
}
const deleteUser = async (req, res, next) => {

    const email = req.body.email || "";
    const password = req.body.password || "";


    if (!email || !password) {
        return next(new RequestError("email and password fields are required!"));
    }

    if (!validator.isEmail(email))
        return next(new RequestError("invalid email"));


    try {
        const result = await UserService.deleteUser(email, password);
        if (!result) return next(new RequestError("Delete operation failed"));
        return res.json({success: true});
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req, res, next) => {
    const email = req.body.email || "";
    const currentPassword = req.body.currentPassword || "";
    const newPassword = req.body.newPassword || "";
    const newPasswordConfirm = req.body.newPasswordConfirm || "";

    if (!email || !currentPassword || !newPassword || !newPasswordConfirm) {
        return next(new RequestError("email, currentPassword, newPassword and newPasswordConfirm fields are required!"));
    }

    if (!validator.isEmail(email))
        return next(new RequestError("invalid email"));

    if (newPassword.length < 6)
        return next(new RequestError("password must be at least 6 characters!"));

    if (newPassword !== newPasswordConfirm)
        return next(new RequestError("newPassword and newPasswordConfirm don't match!"));

    try {
        const result = await UserService.changePassword(email, currentPassword, newPassword);

        if (!result) return next(new RequestError("Something went wrong during password change"));

        return res.json({success: true});
    } catch (error) {
        next(error)
    }
}

const changeUserType = async (req, res, next) => {
    const email = req.body.email || "";
    const userType = req.body.userType || "";


    if (!email || !userType) {
        return next(new RequestError("email and userType fields are required!"));
    }

    if (!validator.isEmail(email))
        return next(new RequestError("invalid email"));

    if (!USER_TYPES.includes(userType))
        return next(new RequestError("invalid userType, possible userType: LLM, AnnotationService"));

    try {
        const result = await UserService.changeUserType(email, userType);

        if (!result) return next(new RequestError("Something went wrong during userType change"));

        return res.json({success: true});
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createUser,
    changePassword,
    changeUserType,
    deleteUser
}