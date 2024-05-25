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
 * Get All Users
 */
const getAll = async (req) => {
    const username = req.query.username || "";
    const role = req.query.role || "";
    const limit = req.query.limit;
    const offset = req.query.offset;

    const sql =
        `SELECT
            u.*
        FROM
            user u
        WHERE
            username LIKE ?
        AND
            role LIKE ?
        LIMIT ?
        OFFSET ?`;

    const params = [
        `%${username}%`,
        `%${role}%`,
        limit,
        offset,
    ];

    const result = await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });

    if (!result[0]) {
        return null;
    }

    return result[0];
};

/**
 * Get One User
 */
const getOne = async (req, id) => {
    const sql =
        `SELECT
            u.*
        FROM
            user u
        WHERE
            u.username=?`;

    const parmas = [
        id,
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
 */
const create = async (data) => {
    const {
        username,
        password,
        role,
    } = data;

    const sql =
       `INSERT INTO
            user
        VALUES
            (?, ?, ?, CURRENT_TIMESTAMP)`;

    const params = [
        username,
        password,
        role,
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Update User
 */
const update = async (id, data) => {
    const {
        password,
        role,
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
        password,
        role,
        id,
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Remove User
 */
const remove = async (id) => {
    const sql =
        `DELETE FROM
            user u
        WHERE
            u.username=?`;

    const parmas = [
        id,
    ];

    await db.pool.execute(sql, parmas)
        .catch(error => {
            throw error;
        });
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
};
