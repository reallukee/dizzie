/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 * Descrizione  : USER
 *                Metodi per la Gestione della Risorsa 'User'
 *                e delle Risorse a Esso Collegate
 * License      : MIT
 * Versione     : 1.0.0
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
 * @param {object} data User Data
 */
const signup = async (data) => {
    const {
        username,   // Username Utente
        password,   // Password Utente
    } = data;

    const sql =
       `INSERT INTO
            user
        VALUES
            (?, ?, "user", CURRENT_TIMESTAMP)`;

    const params = [
        username,   // Username Utente
        password,   // Password Utente
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Sign In
 * @param {object} data User Data
 */
const signin = async (data) => {
    const {
        username,   // Username Utente
        password,   // Password Utente
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
        username,   // Username Utente
        password,   // Password Utente
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

/**
 * Get All Users
 * @param {object} req Request
 * @returns All Users
 */
const getAll = async (req) => {
    const username = req.query.username || "";
    const role = req.query.role || "";
    const limit = req.query.limit;
    const offset = req.query.offset;

    const sql =
        `SELECT
            u.*,
            CONCAT('${api.baseUrl(req)}/users/', u.id) AS endpoint
        FROM
            user u
        WHERE
            u.username LIKE ?
        AND
            u.role LIKE ?
        LIMIT ?
        OFFSET ?`;

    const params = [
        `%${username}%`,    // Filtro Username Utente
        `%${role}%`,        // Filtro Ruolo Utente
        limit,              // Limit
        offset,             // Offset
    ];

    const result = await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });

    if (!result[0] || result[0].length === 0) {
        return null;
    }

    return result[0];
};

/**
 * Get One User
 * @param {string} id User Id
 * @param {object} req Request
 * @returns One User
 */
const getOne = async (id, req) => {
    const sql =
        `SELECT
            u.*
        FROM
            user u
        WHERE
            u.username=?`;

    const parmas = [
        id, // Username Utente
    ];

    const result = await db.pool.execute(sql, parmas)
        .catch(error => {
            throw error;
        });

    if (!result[0][0]) {
        return null;
    }

    return result[0][0];
};

/**
 * Create User
 * @param {object} data User Data
 */
const create = async (data) => {
    const {
        username,   // Username Utente
        password,   // Password Utente
        role,       // Ruolo Utente
    } = data;

    const sql =
       `INSERT INTO
            user
        VALUES
            (?, ?, ?, CURRENT_TIMESTAMP)`;

    const params = [
        username,   // Username Utente
        password,   // Password Utente
        role,       // Ruolo Utente
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Update User
 * @param {string} id User Id
 * @param {object} data User Data
 */
const update = async (id, data) => {
    const {
        password,   // Password Utente
        role,       // Ruolo Utente
    } = data;

    const sql =
        `UPDATE
            user u
        SET
            u.password=?,
            u.role=?
        WHERE
            u.username=?`;

    const params = [
        password,   // Password Utente
        role,       // Ruolo Utente
        id,         // Username Utente
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Remove User
 * @param {string} id User Id
 */
const remove = async (id) => {
    const sql =
        `DELETE FROM
            user u
        WHERE
            u.username=?`;

    const parmas = [
        id, // Username Utente
    ];

    await db.pool.execute(sql, parmas)
        .catch(error => {
            throw error;
        });
};

module.exports = {
    signup,
    signin,
    getAll,
    getOne,
    create,
    update,
    remove,
};
