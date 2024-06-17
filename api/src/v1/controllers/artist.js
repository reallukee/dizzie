/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 * Descrizione  : ARTIST
 *                Metodi per la Gestione della Risorsa 'Artist'
 *                e delle Risorse a Esso Collegate
 * License      : MIT
 * Versione     : 1.0.0
 */

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

/**
 * Get All Requests
 * @param {object} req Request
 * @returns All Artists
 */
const getAll = async (req) => {
    const name = req.query.name || "";
    const service = req.query.service || "";
    const limit = req.query.limit;
    const offset = req.query.offset;

    const sql =
        `SELECT
            a.*,
            JSON_OBJECT(
                'name', s.name,
                'friendlyName', s.friendlyName,
                'url', s.url,
                'endpoint', CONCAT('${api.baseUrl(req)}/services/', s.name)
            ) AS service,
            CONCAT('${api.baseUrl(req)}/artists/', a.id) AS endpoint
        FROM
            artist a
        JOIN
            service s ON s.name=a.service
        WHERE
            a.name LIKE ?
        AND
            a.service LIKE ?
        LIMIT ?
        OFFSET ?`;

    const params = [
        `%${name}%`,    // Filtro Nome Artista
        `%${service}%`, // Filtro Nome Servizio
        limit,          // Limit
        offset,         // Offset
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
 * Get One Artist
 * @param {string} id Artist Id
 * @param {object} req Request
 * @returns One Artist
 */
const getOne = async (id, req) => {
    const sql =
        `SELECT
            a.*,
            JSON_OBJECT(
                'name', s.name,
                'friendlyName', s.friendlyName,
                'url', s.url,
                'endpoint', CONCAT('${api.baseUrl(req)}/services/', s.name)
            ) AS service
        FROM
            artist a
        JOIN
            service s ON s.name=a.service
        WHERE
            a.id=?`;

    const params = [
        id, // Id Artista
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
 * Create Artist
 * @param {object} data Artist Data
 */
const create = async (data) => {
    const {
        id,         // Id Artista
        name,       // Nome Artista
        url,        // Url Artista
        service,    // Id Servizio
    } = data;

    const sql =
        `INSERT INTO
            artist
        VALUES
            (?, ?, ?, DEFAULT, DEFAULT, ?)`;

    const params = [
        id,         // Id Artista
        name,       // Nome Artista
        url,        // Url Artista
        service,    // Id Servizio
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Update Artist
 * @param {string} id Artist Id
 * @param {object} data Artist Data
 */
const update = async (id, data) => {
    const {
        name,   // Nome Artista
        url,    // Url Artista
    } = data;

    const sql =
        `UPDATE
            artist a
        SET
            a.name=?,
            a.url=?
        WHERE
            a.id=?`;

    const params = [
        name,   // Nome Artista
        url,    // Url Artista
        id,     // Id Artista
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Remove Artist
 * @param {string} id Artist Id
 */
const remove = async (id) => {
    const sql =
        `DELETE FROM
            artist a
        WHERE
            a.id=?`;

    const params = [
        id, // Id Artista
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
