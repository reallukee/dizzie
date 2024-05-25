/**
 * Dizzie REST API
 *
 * https://github.com/reallukee/dizzie
 *
 * Author   : Luca Pollicino
 * License  : MIT
 */

const jwt = require("jsonwebtoken");    // JsonWebToken
const crypto = require("crypto");       // Crypto
const dotenv = require("dotenv");       // DotEnv

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

dotenv.config();

const secret = process.env.SECRET || "1234";    // Secret

/**
 * Sign Up
 */
const signup = async (data) => {
    const {
        username,
        password,
    } = data;

    const sql =
       `INSERT INTO
            user
        VALUES
            (?, ?, "user", CURRENT_TIMESTAMP)`;

    const params = [
        username,
        password,
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Sign In
 */
const signin = async (data) => {
    const {
        username,
        password,
    } = data;

    const sql =
        `SELECT
            u.*
        FROM
            user u
        WHERE
            u.username=?
        AND
            u.password=?`;

    const params = [
        username,
        password,
    ];

    const result = await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });

    if (!result[0][0]) {
        return null;
    }

    const payload = {
        username,
        role: result[0][0].role,
        version: 1,
    };

    const options = {
        expiresIn: "1h",
    };

    const token = jwt.sign(payload, secret, options);

    return {
        token,
        role: result[0][0].role,
        version: 1,
    };
};

module.exports = {
    signup,
    signin,
};
