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
 * Error Middleware
 */
const error = (error, req, res, next) => {
    if (error) {
        console.error(error);

        return res.status(500).json(
            api.simpleResponse(req, 500, "Internal Server Error")
        );
    }

    return next();
};

module.exports = error;
