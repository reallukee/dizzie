/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 *                (https://github.com/reallukee)
 * Descrizione  : PLAYLIST
 *                Metodi per la Gestione della Risorsa 'Playlist'
 *                e delle Risorse a Esso Collegate
 * License      : MIT
 *                (https://opensource.org/license/mit)
 * Versione     : 1.0.0
 */

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

/**
 * Get All Playlists
 * @param {object} req Request
 * @returns All Playlists
 */
const getAll = async (req) => {
    const name = req.query.name || "";
    const description = req.query.description || "";
    const type = req.query.type || "";
    const visibility = req.query.visibility || "";
    const limit = req.query.limit;
    const offset = req.query.offset;

    const sql =
        `SELECT
            p.*,
            CONCAT('${api.baseUrl(req)}/playlists/', p.id) AS endpoint
        FROM
            playlist p
        WHERE
            p.name LIKE ?
        AND
            p.description LIKE ?
        AND
            p.visibility LIKE ?
        AND
            p.type LIKE ?
        LIMIT ?
        OFFSET ?`;

    const params = [
        `%${name}%`,        // Filtro Nome Playlist
        `%${description}%`, // Filtro Descrizione Playlist
        `%${visibility}%`,  // Filtro Visibilità Playlist
        `%${type}%`,        // Filtro Tipo Playlist
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
 * Get One Playlist
 * @param {string} id Playlist Id
 * @param {object} req Request
 * @returns One Playlisy
 */
const getOne = async (id, req) => {
    const sql =
        `SELECT
            p.*
        FROM
            playlist p
        WHERE
            p.id=?`;

    const params = [
        id, // Id Playlist
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
 * Create Playlist
 * @param {object} data Playlist Data 
 */
const create = async (data) => {
    const {
        name,           // Nome Playlist
        description,    // Descrizione Playlist
        visibility,     // Visibilità Playlist
        type,           // Tipo Playlist
    } = data;

    const sql =
        `INSERT INTO
            playlist
        VALUES
            (DEFAULT, ?, ?, ?, ?, DEFAULT, DEFAULT)`;

    const params = [
        name,           // Nome Playlist
        description,    // Descrizione Playlist
        visibility,     // Visibilità Playlist
        type,           // Tipo Playlist
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Update Playlist
 * @param {string} id Playlist id
 * @param {object} data Playlist Data
 */
const update = async (id, data) => {
    const {
        name,           // Nome Playlist
        description,    // Descrizione Playlist
        visibility,     // Visibilità Playlist
        type,           // Tipo Playlist
    } = data;

    const sql =
        `UPDATE
            playlist p
        SET
            p.name=?,
            p.description=?,
            p.visibility=?,
            p.type=?,
            p.updatedOn=CURRENT_TIMESTAMP
        WHERE
            p.id=?`;

    const params = [
        name,           // Nome Playlist
        description,    // Descrizione Playlist
        visibility,     // Visibilità Playlist
        type,           // Tipo Playlist
        id,             // Id Playlist
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Remove Playlist
 * @param {string} id Playlist Id 
 */
const remove = async (id) => {
    const sql =
        `DELETE FROM
            playlist p
        WHERE
            p.id=?`;

    const params = [
        id, // Id Playlist
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
