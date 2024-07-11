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
 * Log Middleware
 */
const log = (req, res, next) => {
    console.log(`${req.method} ${api.fullUrl(req)}`);

    return next();
};

module.exports = log;
