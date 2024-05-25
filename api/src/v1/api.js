/**
 * Dizzie REST API
 *
 * https://github.com/reallukee/dizzie
 *
 * Author   : Luca Pollicino
 * License  : MIT
 */

const url = require("url");         // URL
const dotenv = require("dotenv");   // DotEnv

const common = require("./common"); // Common

dotenv.config();

/**
 * Get Full Url
 */
const fullUrl = (req) => {
    return url.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: req.originalUrl.split("?")[0],
        query: req.query,
    });
};

/**
 * Get Base Url
 */
const baseUrl = (req) => {
    return url.format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: `api/v${common.version}`,
        query: null,
    });
};

/**
 * Get Simple Response
 */
const simpleResponse = (req, status, message) => {
    return {
        url: fullUrl(req),
        status,
        message,
    };
};

/**
 * Get Data Response
 */
const dataResponse = (req, status, message, data) => {
    return {
        url: fullUrl(req),
        status,
        message,
        data,
        meta: {
            count: 0,
            total: 0,
            next: null,
            previous: null,
        },
    };
};

module.exports = {
    fullUrl,
    baseUrl,
    simpleResponse,
    dataResponse,
};
