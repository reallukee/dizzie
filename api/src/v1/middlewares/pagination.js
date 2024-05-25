/**
 * Dizzie REST API
 *
 * https://github.com/reallukee/dizzie
 *
 * Author   : Luca Pollicino
 * License  : MIT
 */

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

/**
 * Pagination Middleware
 */
const pagination = (req, res, next) => {
    const limit = req.query.limit || 100;

    if (limit < 1 || limit > 100) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Invalid Query")
        );
    }

    req.query.limit = limit.toString();

    const offset = req.query.offset || 0;

    if (offset < 0) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Invalid Query")
        )
    }

    req.query.offset = offset.toString();

    return next();
};

module.exports = pagination;
