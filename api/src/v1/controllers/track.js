/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 * Descrizione  : TRACK
 *                Metodi per la Gestione della Risorsa 'Track'
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
 * @returns All Tracks
 */
const getAll = async (req) => {
    const name = req.query.name || "";
    const service = req.query.service || "";
    const limit = req.query.limit;
    const offset = req.query.offset;

    const sql =
        `SELECT
            t.*,
            JSON_OBJECT(
                'name', s.name,
                'friendlyName', s.friendlyName,
                'url', s.url,
                'endpoint', CONCAT('${api.baseUrl(req)}/services/', s.name)
            ) AS service,
            CONCAT('${api.baseUrl(req)}/tracks/', t.id) AS endpoint
        FROM
            track t
        JOIN
            service s ON s.name=t.service
        WHERE
            t.name LIKE ?
        AND
            t.service LIKE ?
        LIMIT ?
        OFFSET ?`;

    const params = [
        `%${name}%`,    // Filtro Nome Traccia
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
 * Get One Track
 * @param {string} id Track Id
 * @param {object} req Request
 * @returns One Track
 */
const getOne = async (id, req) => {
    const sql =
        `SELECT
            t.*,
            JSON_OBJECT(
                'name', s.name,
                'friendlyName', s.friendlyName,
                'url', s.url,
                'endpoint', CONCAT('${api.baseUrl(req)}/services/', s.name)
            ) AS service
        FROM
            track t
        JOIN
            service s ON s.name=t.service
        WHERE
            t.id=?`;

    const params = [
        id, // Id Traccia
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
 * Create Track
 * @param {object} data Track Data
 */
const create = async (data) => {
    const {
        id,         // Id Traccia
        name,       // Nome Traccia
        url,        // Url Traccia
        service,    // Id Servizio
    } = data;

    const sql =
        `INSERT INTO
            track
        VALUES
            (?, ?, ?, DEFAULT, DEFAULT, ?)`;

    const params = [
        id,         // Id Traccia
        name,       // Nome Traccia
        url,        // Url Traccia
        service,    // Id Servizio
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Update Track
 * @param {string} id Track Id
 * @param {object} data Track Data
 */
const update = async (id, data) => {
    const {
        name,   // Nome Traccia
        url,    // Url Traccia
    } = data;

    const sql =
        `UPDATE
            track t
        SET
            t.name=?,
            t.url=?
        WHERE
            t.id=?`;

    const params = [
        name,   // Nome Traccia
        url,    // Url Traccia
        id,     // Id Traccia
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Remove Track
 * @param {string} id Track Id
 */
const remove = async (id) => {
    const sql =
        `DELETE FROM
            track t
        WHERE
            t.id=?`;

    const params = [
        id, // Id Traccia
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};



/**
 * Create Track Album
 * @param {string} id Track Id
 * @param {object} data Track Album Data
 */
const createAlbum = async (id, data) => {
    const {
        album,  // Id Album
    } = data;

    const sql =
        `INSERT INTO
            track_album
        VALUES
            (?, ?)`;

    const params = [
        id,     // Id Traccia
        album,  // Id Album
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Update Track Album
 * @param {string} id Track Id
 * @param {string} album Album Id
 * @param {object} data Album Data
 */
const updateAlbum = async (id, album, data) => {
    const {

    } = data;

    const sql =
        `UPDATE
            track_album ta
        SET

        WHERE
            ta.track=?
        AND
            ta.album=?`;

    const params = [
        id,     // Id Track
        album,  // Id Album
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Remove Track Album
 * @param {string} id Track Id
 * @param {string} album Album Id
 */
const removeAlbum = async (id, album) => {
    const sql =
        `DELETE FROM
            track_album ta
        WHERE
            ta.track=?
        AND
            ta.album=?`;

    const params = [
        id,     // Id Traccia
        album,  // Id Album
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};



/**
 * Create Track Artist
 * @param {string} id Track Id
 * @param {object} data Track Artist Data
 */
const createArtist = async (id, data) => {
    const {
        artist, // Id Artista
    } = data;

    const sql =
        `INSERT INTO
            track_artist
        VALUES
            (?, ?)`;

    const params = [
        id,     // Id Track
        artist, // Id Artista
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Update Track Artist
 * @param {string} id Track Id
 * @param {string} track Artist Id
 * @param {object} data Artist Data
 */
const updateArtist = async (id, artist, data) => {
    const {

    } = data;

    const sql =
        `UPDATE
            track_artist ta
        SET

        WHERE
            ta.track=?
        AND
            ta.artist=?`;

    const params = {
        id,     // Id Traccia
        artist, // Id Artista
    };

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Remove Track Artist
 * @param {string} id Track Id
 * @param {string} artist Artist Id
 */
const removeArtist = async (id, artist) => {
    const sql =
        `DELETE FROM
            track_artist ta
        WHERE
            ta.track=?
        AND
            ta.artist=?`;

    const params = [
        id,     // Id Traccia
        artist, // Id Artista
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
    createAlbum,
    updateAlbum,
    removeAlbum,
    createArtist,
    updateArtist,
    removeArtist,
};
