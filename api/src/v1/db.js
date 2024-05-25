/**
 * Dizzie REST API
 *
 * https://github.com/reallukee/dizzie
 *
 * Author   : Luca Pollicino
 * License  : MIT
 */

const mysql2 = require("mysql2");   // MySQL2
const dotenv = require("dotenv");   // DotEnv

const common = require("./common"); // Common

dotenv.config();

const host = process.env.DB_HOST || "0.0.0.0";          // Host
const user = process.env.DB_USER || "root";             // User
const password = process.env.DB_PASSWORD || "";         // Password
const database = process.env.DB_DATABASE || "dizzie";   // Database

const options = {
    host,
    user,
    password,
    database,
};

module.exports.pool = mysql2.createPool(options).promise();
