/**
 * Dizzie REST API
 *
 * https://github.com/reallukee/dizzie
 *
 * Author   : Luca Pollicino
 * License  : MIT
 */

const jwt = require("jsonwebtoken");    // JWT
const crypto = require("crypto");       // Crypto
const dotenv = require("dotenv");       // DotEnv

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

dotenv.config();

const secret = process.env.SECRET || "1234";    // Secret

/**
 * Auth View
 */
const authView = async (req, res, next) => {
    let token = req.headers.authorization || req.body.authorization;

    if (token.split(" ").length > 1 && token.split(" ")[0] === "Bearer") {
        token = token.split(" ")[1];
    }

    if (!token) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Missing Token")
        );
    }

    try {
        const payload = jwt.verify(token, secret);

        res.locals.payload = payload;
    } catch (error) {
        return res.status(401).json(
            api.simpleResponse(req, 401, "Invalid Token")
        );
    }

    return next();
};

/**
 * Auth
 */
const auth = async (req, res, next) => {
    let token = req.headers.authorization || req.body.authorization;

    if (token.split(" ").length > 1 && token.split(" ")[0] === "Bearer") {
        token = token.split(" ")[1];
    }

    if (!token) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Missing Token")
        );
    }

    try {
        const payload = jwt.verify(token, secret);

        if (payload.role === common.role.guest) {
            return res.status(403).json(
                api.simpleResponse(req, 403, "Invalid Permissions")
            );
        }

        res.locals.payload = payload;
    } catch (error) {
        return res.status(401).json(
            api.simpleResponse(req, 401, "Invalid Token")
        );
    }

    return next();
};

/**
 * Auth Plus
 */
const authPlus = async (req, res, next) => {
    let token = req.headers.authorization || req.body.authorization;

    if (token.split(" ").length > 1 && token.split(" ")[0] === "Bearer") {
        token = token.split(" ")[1];
    }

    if (!token) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Missing Token")
        );
    }

    try {
        const payload = jwt.verify(token, secret);

        console.log(payload)

        if (payload.role === common.role.guest) {
            return res.status(403).json(
                api.simpleResponse(req, 403, "Invalid Permissions")
            );
        }

        if (payload.role === common.role.user) {
            return res.status(403).json(
                api.simpleResponse(req, 403, "Invalid Permissions")
            );
        }

        res.locals.payload = payload;
    } catch (error) {
        return res.status(401).json(
            api.simpleResponse(req, 401, "Invalid Token")
        );
    }

    return next();
};

module.exports = {
    authView,
    auth,
    authPlus,
};
