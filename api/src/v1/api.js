/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 * Descrizione  : API
 * License      : MIT
 * Versione     : 1.0.0
 */

const url = require("url");         // URL
const dotenv = require("dotenv");   // DotEnv

const common = require("./common"); // Common

dotenv.config();

/**
 * Get Full Url
 * @param {object} req Request
 * @returns Full Url
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
 * @param {object} req Request
 * @returns Base Url
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
const simpleResponse = (req, status, message, data) => {
    return {
        url: fullUrl(req),
        status,
        message,
        data,
    };
};

/**
 * Get Full Response
 */
const fullResponse = (req, status, message, data) => {
    return {
        url: fullUrl(req),
        status,
        message,
        data,
    };
};

module.exports = {
    fullUrl,
    baseUrl,
    simpleResponse,
    fullResponse,
};
