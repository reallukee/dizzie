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

const express = require("express");     // Express

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

const controller = require("../controllers/service");       // Controller

const { authView } = require("../middlewares/auth");        // AuthView
const { auth } = require("../middlewares/auth");            // Auth
const { authPlus } = require("../middlewares/auth");        // AuthPlus

const pagination = require("../middlewares/pagination");    // Pagination

const router = express.Router();

/**
 * Get All Services
 */
router.get("/services", authView, pagination, async (req, res, next) => {
    const response = await controller.getAll(req)
        .catch(error => {
            throw error;
        });

    try {
        const status = response ? 200 : 204;
        const message = status === 200 ? "OK" : "No Services";

        return res.status(200).json(
            api.fullResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Get One Service
 */
router.get("/services/:id", authView, async (req, res, next) => {
    const id = req.params.id;   // Id Servizio

    // Restituisco il Servizio
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        const status = response ? 200 : 404;
        const message = status === 200 ? "OK" : "Service Not Found";

        return res.status(status).json(
            api.simpleResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Create Service
 */
router.post("/services", authPlus, async (req, res, next) => {
    const name = req.body.name || null;
    const friendlyName = req.body.friendlyName || null;
    const url = req.body.url || null;

    // Controllo i Campi del Body
    if (!name || !friendlyName || !url) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    // Controllo se il Servizio Esiste
    const result = await controller.getOne(name, req)
        .catch(error => {
            throw error;
        });

    try {
        if (result) {
            return res.status(409).json(
                api.simpleResponse(req, 409, "Service Already Exists")
            );
        }
    } catch (error) {
        throw error;
    }

    // Creo il Servizio
    const data = {
        name,           // Nome Servizio
        friendlyName,   // Nome Amichevole Servizio
        url,            // Url Servizio
    };

    await controller.create(data)
        .catch(error => {
            throw error;
        });

    // Restituisco il Servizio
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(201).json(
            api.simpleResponse(req, 201, "Service Created", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Update Service
 */
router.put("/services/:id", authPlus, async (req, res, next) => {
    const id = req.params.id;   // Id Servizio

    // Controllo se il Servizio Esiste
    const result = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!result) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "Service Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    // Modifico il Servizio
    const friendlyName = req.body.friendlyName || result.friendlyName;
    const url = req.body.url || result.url;

    // Controllo i Campi del Body
    if (!friendlyName || !url) {
        return res.status(404).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    const data = {
        friendlyName,   // Nome Amichevole Servizio
        url,            // Url Servizio
    };

    await controller.update(id, data)
        .catch(error => {
            throw error;
        });

    // Restituisco il Servizio
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(200).json(
            api.simpleResponse(req, 200, "Service Updated", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Delete Service
 */
router.delete("/services/:id", authPlus, async (req, res, next) => {
    const id = req.params.id;   // Id Servizio

    // Controllo se il Servizio Esiste
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!response) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "Service Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    // Elimino il Servizio
    await controller.remove(id)
        .catch(error => {
            throw error;
        });

    return res.status(204).json(
        api.simpleResponse(req, 204, "Service Deleted", response)
    );
});

module.exports = router;
