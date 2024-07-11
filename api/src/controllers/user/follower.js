/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 *                (https://github.com/reallukee)
 * Descrizione  : USER FOLLOWER
 *                Metodi per la Gestione della Risorsa 'User Follower'
 *                e delle Risorse a Esso Collegate
 * License      : MIT
 *                (https://opensource.org/license/mit)
 * Versione     : 1.0.0
 */

const common = require("../../common"); // Common
const db = require("../../db");         // Database
const api = require("../../api");       // API

/**
 * Get All User Followers
 * @param {string} user User Username
 * @param {object} req Request
 * @returns All User Followers
 */
const getAll = async (user, req) => {
    const limit = req.query.limit;
    const offset = req.query.offset;

    const sql =
        `SELECT
            u.*
        FROM
            user_follower uf
        JOIN
            user u ON u.username=uf.follower
        WHERE
            uf.user=?
        LIMIT ?
        OFFSET ?`;

    const params = [
        user,   // Username Utente
        limit,  // Limit
        offset, // Offset
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
 * Get One User Follower
 * @param {string} user User Username
 * @param {string} id Follower Username
 * @param {object} req Requests
 * @returns One User Follower
 */
const getOne = async (user, id, req) => {
    const sql =
        `SELECT
            u.*
        FROM
            user_follower uf
        JOIN
            user u ON u.username=uf.follower
        WHERE
            uf.user=?
        AND
            uf.follower=?`;

    const params = [
        user,   // Username Utente
        id,     // Username Follower
    ];

    const result = await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });

    if (!result[0][0]) {
        return null;
    }

    return result[0][0];
};

/**
 * Create User Follower
 * @param {string} user Username Utente
 * @param {*} data Follower Data
 */
const create = async (user, data) => {
    const {
        follower,   // Username Follower
    } = data;

    // * user
    // * follower
    // * followedOn

    const sql =
        `INSERT INTO
            user_follower
        VALUES
            (?, ?, DEFAULT)`;

    const params = [
        user,       // Username Utente
        follower,   // Username Follower
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Update User Follower
 * @param {string} user Username Utente
 * @param {string} id Username Follower
 * @param {object} data Follower Data
 */
const update = async (user, id, data) => {
    const {
    } = data;

    const sql =
        `UPDATE
            user_follower uf
        SET
        WHERE
            uf.user=?
        AND
            uf.follower=?`;

    const params = [
        user,   // Username Utente
        id,     // Username Follower
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Remove User Follower
 * @param {string} user Username Utente
 * @param {string} id Username Follower
 */
const remove = async (user, id) => {
    const sql =
        `DELETE FROM
            user_follower uf
        WHERE
            uf.user=?
        AND
            uf.follower=?`;

    const params = [
        user,   // Username Utente
        id,     // Username Follower
    ];

    await db.pool.execute(sql, params)
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
