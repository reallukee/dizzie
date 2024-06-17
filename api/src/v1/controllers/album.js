/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 * Descrizione  : ALBUM
 *                Metodi per la Gestione della Risorsa 'Album'
 *                e delle Risorse a Esso Collegate
 * License      : MIT
 * Versione     : 1.0.0
 */

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

/**
 * Get All Albums
 * @param {object} req Request
 * @returns All Albums
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
            CONCAT('${api.baseUrl(req)}/albums/', a.id) AS endpoint
        FROM
            album a
        JOIN
            service s ON s.name=a.service
        WHERE
            a.name LIKE ?
        AND
            a.service LIKE ?
        LIMIT ?
        OFFSET ?`;

    const params = [
        `%${name}%`,    // Filtro Nome Album
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
 * Get One Album
 * @param {string} id Album Id
 * @param {object} req Request
 * @returns One Album
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
            album a
        JOIN
            service s ON s.name=a.service
        WHERE
            a.id=?`;

    const params = [
        id, // Id Album
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
 * Create Album
 * @param {object} data Album Data
 */
const create = async (data) => {
    const {
        id,         // Id Album
        name,       // Nome Album
        url,        // Url Album
        service,    // Id Servizio
    } = data;

    const sql =
        `INSERT INTO
            album
        VALUES
            (?, ?, ?, DEFAULT, DEFAULT, ?)`;

    const params = [
        id,         // Id Album
        name,       // Nome Album
        url,        // Url Album
        service,    // Id Servizio
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Update Album
 * @param {string} id Album Id
 * @param {object} data Album Data
 */
const update = async (id, data) => {
    const {
        name,   // Nome Album
        url,    // Url Album
    } = data;

    const sql =
        `UPDATE
            album a
        SET
            a.name=?,
            a.url=?
        WHERE
            a.id=?`;

    const params = [
        name,   // Nome Album
        url,    // Url Album
        id,     // Id Album
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Remove Album
 * @param {string} id Album Id
 */
const remove = async (id) => {
    const sql =
        `DELETE FROM
            album a
        WHERE
            a.id=?`;

    const params = [
        id, // Album Id
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};



/**
 * Get One Album Track
 * @param {string} id Album Id
 * @param {string} track Track Id
 * @param {object} req Request
 * @returns One Album Track
 */
const getOneTrack = async (id, track, req) => {
    const sql =
        `SELECT
            t.*
        FROM
            track_album ta
        JOIN
            track t ON t.id=ta.track
        WHERE
            ta.track=?
        AND
            ta.album=?`;

    const params = [
        track,  // Id Traccia
        id,     // Id Album
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
 * Create Album Track
 * @param {string} id Album Id
 * @param {object} data Album Track Data
 */
const createTrack = async (id, data) => {
    const {
        track,  // Id Traccia
    } = data;

    const sql =
        `INSERT INTO
            track_album
        VALUES
            (?, ?)`;

    const params = [
        track,  // Id Traccia
        id,     // Id Album
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Update Album Track
 * @param {string} id Album Id
 * @param {string} track Track Id
 * @param {object} data Track Data
 */
const updateTrack = async (id, track, data) => {
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

    const params = {
        track,  // Id Traccia
        id,     // Id Album
    };

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Remove Album Track
 * @param {string} id Album Id
 * @param {string} track Track Id
 */
const removeTrack = async (id, track) => {
    const sql =
        `DELETE FROM
            track_album ta
        WHERE
            ta.track=?
        AND
            ta.album=?`;

    const params = [
        track,  // Id Traccia
        id,     // Id Album
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};



/**
 * Get One Album Artist
 * @param {string} id Album Id
 * @param {string} artist Artist Id
 * @param {object} req Request
 * @returns One Album Track
 */
const getOneArtist = async (id, artist, req) => {
    const sql =
        `SELECT
            t.*
        FROM
            album_artist aa
        JOIN
            artist a ON a.id=aa.artist
        WHERE
            aa.album=?
        AND
            aa.artist=?`;

    const params = [
        id,     // Id Album
        artist, // Id Artista
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
 * Create Album Artist
 * @param {string} id Album Id
 * @param {object} data Album Artist Data
 */
const createArtist = async (id, data) => {
    const {
        artist, // Id Artista
    } = data;

    const sql =
        `INSERT INTO
            album_artist
        VALUES
            (?, ?)`;

    const params = [
        id,     // Id Album
        artist, // Id Artista
    ];

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Update Album Track
 * @param {string} id Album Id
 * @param {string} track Track Id
 * @param {object} data Track Data
 */
const updateArtist = async (id, track, data) => {
    const {

    } = data;

    const sql =
        `UPDATE
            album_artist aa
        SET

        WHERE
            aa.album=?
        AND
            aa.artist=?`;

    const params = {
        id,     // Id Album
        artist, // Id Artista
    };

    await db.pool.execute(sql, params)
        .catch(error => {
            throw error;
        });
};

/**
 * Remove Album Artist
 * @param {string} id Album Id
 * @param {string} artist Artist Id
 */
const removeArtist = async (id, artist) => {
    const sql =
        `DELETE FROM
            album_artist aa
        WHERE
            aa.album=?
        AND
            ta.artist=?`;

    const params = [
        id,     // Id Album
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
    getOneTrack,
    createTrack,
    updateTrack,
    removeTrack,
    getOneArtist,
    createArtist,
    updateArtist,
    removeArtist,
};
