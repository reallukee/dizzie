/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 *                (https://github.com/reallukee)
 * Descrizione  : SERVICE
 *                Metodi per la Gestione della Risorsa 'Service'
 *                e delle Risorse a Esso Collegate
 * License      : MIT
 *                (https://opensource.org/license/mit)
 * Versione     : 1.0.0
 */

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

/**
 * Get All Services
 * @param {object} req Request
 * @returns All Services
 */
const getAll = async (req) => {
    const name = req.query.name || "";
    const friendlyName = req.query.friendlyName || "";
    const limit = req.query.limit;
    const offset = req.query.offset;

    const sql =
        `SELECT
            s.*,
            CONCAT('${api.baseUrl(req)}/services/', s.name) AS endpoint
        FROM
            service s
        WHERE
            s.name LIKE ?
        AND
            s.friendlyName LIKE ?
        LIMIT ?
        OFFSET ?`;

    const params = [
        `%${name}%`,            // Filtro Nome Servizio
        `%${friendlyName}%`,    // Filtro Nome Amichevole Servizio
        limit,                  // Limit
        offset,                 // Offset
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
 * Get One Service
 * @param {string} id Service Id
 * @param {object} req Request
 * @returns One Service
 */
const getOne = async (id, req) => {
    const sql =
        `SELECT
            s.*
        FROM
            service s
        WHERE
            s.name=?`;

    const params = [
        id, // Nome Servizio
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
 * Create Service
 * @param {object} data Service Data
 */
const create = async (data) => {
    const {
        name,           // Nome Servizio
        friendlyName,   // Nome Amichevole Servizio
        url,            // Url Servizio
    } = data;

    const sql =
        `INSERT INTO
            service
        VALUES
            (?, ?, ?)`;

    const params = [
        name,           // Nome Servizio
        friendlyName,   // Nome Amichevole Servizio
        url,            // Url Servizio
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Update Service
 * @param {string} id Service Id
 * @param {object} data Service Data
 */
const update = async (id, data) => {
    const {
        friendlyName,   // Nome Amichevole Servizio
        url,            // Url Servizio
    } = data;

    const sql =
        `UPDATE
            service s
        SET
            s.friendlyName=?,
            s.url=?
        WHERE
            s.name=?`;

    const params = [
        friendlyName,   // Nome Amichevole Servizio
        url,            // Url Servizio
        id,             // Nome Servizio
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Remove Service
 * @param {string} id Service Id
 */
const remove = async (id) => {
    const sql =
        `DELETE FROM
            service s
        WHERE
            s.name=?`;

    const params = [
        id, // Nome Servizio
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
