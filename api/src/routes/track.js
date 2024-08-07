/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 *                (https://github.com/reallukee)
 * Descrizione  : TRACK
 *                Metodi per la Gestione della Risorsa 'Track'
 *                e delle Risorse a Esso Collegate
 * License      : MIT
 *                (https://opensource.org/license/mit)
 * Versione     : 1.0.0
 */

const express = require("express");     // Express

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

const controller = require("../controllers/track");             // Controller

const serviceController = require("../controllers/service");    // Service Controller

const { authView } = require("../middlewares/auth");        // AuthView
const { auth } = require("../middlewares/auth");            // Auth
const { authPlus } = require("../middlewares/auth");        // AuthPlus

const pagination = require("../middlewares/pagination");    // Pagination

const router = express.Router();

/**
 * Get All Tracks
 */
router.get("/tracks", authView, pagination, async (req, res, next) => {
    const response = await controller.getAll(req)
        .catch(error => {
            throw error;
        });

    try {
        const status = response ? 200 : 204;
        const message = status === 200 ? "OK" : "No Tracks";

        return res.status(200).json(
            api.fullResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Get One Track
 */
router.get("/tracks/:id", authView, async (req, res, next) => {
    const id = req.params.id;   // Id Traccia

    // Restituisco la Traccia
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        const status = response ? 200 : 404;
        const message = status === 200 ? "OK" : "Track Not Found";

        return res.status(status).json(
            api.simpleResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Create Track
 */
router.post("/tracks", authPlus, async (req, res, next) => {
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

    // Controllo se la Traccia Esiste
    const result = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (result) {
            return res.status(409).json(
                api.simpleResponse(req, 409, "Track Already Exists")
            );
        }
    } catch (error) {
        throw error;
    }

    // Creo la Traccia
    const data = {
        id,         // Id Traccia
        name,       // Nome Traccia
        url,        // Url Traccia
        service,    // Id Servizio
    };

    await controller.create(data)
        .catch(error => {
            throw error;
        });

    // Restituisco la Traccia
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(201).json(
            api.simpleResponse(req, 201, "Track Created", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Update Track
 */
router.put("/tracks/:id", authPlus, async (req, res, next) => {
    const id = req.params.id;   // Id Traccia

    // Controllo se la Traccia Esiste
    const result = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!result) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "Track Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    // Modifico la Traccia
    const name = req.body.name || result.name;
    const url = req.body.url || result.url;

    // Controllo i Campi del Body
    if (!name || !url) {
        return res.status(404).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    const data = {
        name,   // Nome Traccia
        url,    // Url Traccia
    };

    await controller.update(id, data)
        .catch(error => {
            throw error;
        });

    // Restituisco la Traccia
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(200).json(
            api.simpleResponse(req, 200, "Track Updated", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Delete Track
 */
router.delete("/tracks/:id", authPlus, async (req, res, next) => {
    const id = req.params.id;   // Id Traccia

    // Controllo se l'Album Esiste
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!response) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "Track Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    // Elimino la Traccia
    await controller.remove(id)
        .catch(error => {
            throw error;
        });

    return res.status(204).json(
        api.simpleResponse(req, 204, "Track Deleted", response)
    );
});

module.exports = router;
