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
 * Query
 */
const query = (req, res, next) => {
    Object.keys(req.query).forEach(property => {
        const value = req.query[property];

        if (!isNaN(value)) {
            req.query[property] = parseInt(value);
        }
    });

    return next();
};

module.exports = query;
