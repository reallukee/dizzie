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

const express = require("express");     // Express

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

const controller = require("../controllers/artist");            // Controller

const serviceController = require("../controllers/service");    // Service Controller

const { authView } = require("../middlewares/auth");        // AuthView
const { auth } = require("../middlewares/auth");            // Auth
const { authPlus } = require("../middlewares/auth");        // AuthPlus

const pagination = require("../middlewares/pagination");    // Pagination

const router = express.Router();

/**
 * Get All Artists
 */
router.get("/artists", authView, pagination, async (req, res, next) => {
    const response = await controller.getAll(req)
        .catch(error => {
            throw error;
        });

    try {
        const status = response ? 200 : 204;
        const message = status === 200 ? "OK" : "No Artists";

        return res.status(200).json(
            api.fullResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Get One Artist
 */
router.get("/artists/:id", authView, async (req, res, next) => {
    const id = req.params.id;   // Id Artista

    // Restituisco l'Artista
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        const status = response ? 200 : 404;
        const message = status === 200 ? "OK" : "Artist Not Found";

        return res.status(status).json(
            api.simpleResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Create Artist
 */
router.post("/artists", authPlus, async (req, res, next) => {
    const id = req.body.id || null;
    const name = req.body.name || null;
    const url = req.body.url || null;
    const service = req.body.service || null;

    // Controllo i Campi del Body
    if (!id || !name || !url || !service) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    // Controllo se il Servizio Esiste
    await serviceController.getOne(service, req)
        .then(response => {
            if (!response) {
                return res.status(404).json(
                    api.simpleResponse(req, 404, "Service Not Found")
                );
            }
        })
        .catch(error => {
            throw error;
        });

    // Controllo se l'Artista Esiste
    const result = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (result) {
            return res.status(409).json(
                api.simpleResponse(req, 409, "Artist Already Exists")
            );
        }
    } catch (error) {
        throw error;
    }

    // Creo l'Artista
    const data = {
        id,         // Id Artista
        name,       // Nome Artista
        url,        // Url Artista
        service,    // Id Servizio
    };

    await controller.create(data)
        .catch(error => {
            throw error;
        });

    // Restituisco l'Artista
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(201).json(
            api.simpleResponse(req, 201, "Artist Created", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Update Artist
 */
router.put("/artists/:id", authPlus, async (req, res, next) => {
    const id = req.params.id;   // Id Artista

    // Controllo se l'Artista Esiste
    const result = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!result) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "Artist Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    // Modifico l'Artista
    const name = req.body.name || result.name;
    const url = req.body.url || result.url;

    // Controllo i Campi del Body
    if (!name || !url) {
        return res.status(404).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    const data = {
        name,   // Nome Artista
        url,    // Url Artista
    };

    await controller.update(id, data)
        .catch(error => {
            throw error;
        });

    // Restituisco l'Artista
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(200).json(
            api.simpleResponse(req, 200, "Artist Updated", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Delete Artist
 */
router.delete("/artists/:id", authPlus, async (req, res, next) => {
    const id = req.params.id;   // Id Artista

    // Controllo se l'Artista Esiste
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!response) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "Artist Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    // Elimino l'Artista
    await controller.remove(id)
        .catch(error => {
            throw error;
        });

    return res.status(204).json(
        api.simpleResponse(req, 204, "Artist Deleted", response)
    );
});

module.exports = router;
