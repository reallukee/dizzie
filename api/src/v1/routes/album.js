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

const express = require("express");     // Express

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

const controller = require("../controllers/album");             // Controller

const serviceController = require("../controllers/service");    // Service Controller

const { authView } = require("../middlewares/auth");        // AuthView
const { auth } = require("../middlewares/auth");            // Auth
const { authPlus } = require("../middlewares/auth");        // AuthPlus

const pagination = require("../middlewares/pagination");    // Pagination

const router = express.Router();

/**
 * Get All Albums
 */
router.get("/albums", authView, pagination, async (req, res, next) => {
    const response = await controller.getAll(req)
        .catch(error => {
            throw error;
        });

    try {
        const status = response ? 200 : 204;
        const message = status === 200 ? "OK" : "No Albums";

        return res.status(200).json(
            api.fullResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Get One Album
 */
router.get("/albums/:id", authView, async (req, res, next) => {
    const id = req.params.id;   // Id Album

    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        const status = response ? 200 : 404;
        const message = status === 200 ? "OK" : "Album Not Found";

        return res.status(status).json(
            api.simpleResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Create Album
 */
router.post("/albums", authPlus, async (req, res, next) => {
    const id = req.body.id || null;
    const name = req.body.name || null;
    const url = req.body.url || null;
    const service = req.body.service || null;

    if (!id || !name || !url || !service) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

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

    //
    // Controllo se l'Album Esiste
    //
    const result = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (result) {
            return res.status(409).json(
                api.simpleResponse(req, 409, "Album Already Exists")
            );
        }
    } catch (error) {
        throw error;
    }

    //
    // Creo l'Album
    //
    const data = {
        id,         // Id Album
        name,       // Nome Album
        url,        // Url Album
        service,    // Id Servizio
    };

    await controller.create(data)
        .catch(error => {
            throw error;
        });

    //
    // Restituisco l'Album
    //
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(201).json(
            api.simpleResponse(req, 201, "Album Created", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Update Album
 */
router.put("/albums/:id", authPlus, async (req, res, next) => {
    const id = req.params.id;   // Id Album

    //
    // Controllo se l'Album Esiste
    //
    const result = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!result) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "Album Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    //
    // Modifico l'Album
    //
    const name = req.body.name || result.name;
    const url = req.body.url || result.url;

    if (!name || !url) {
        return res.status(404).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    const data = {
        name,   // Nome Album
        url,    // Url Album
    };

    await controller.update(id, data)
        .catch(error => {
            throw error;
        });

    //
    // Restituisco l'Album
    //
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(200).json(
            api.simpleResponse(req, 200, "Album Updated", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Delete Album
 */
router.delete("/albums/:id", authPlus, async (req, res, next) => {
    const id = req.params.id;   // Id Album

    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!response) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "Album Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    await controller.remove(id)
        .catch(error => {
            throw error;
        });

    return res.status(204).json(
        api.simpleResponse(req, 204, "Album Deleted", response)
    );
});



/**
 * Create Album Track
 */
router.post("/albums/:id/tracks", authPlus, async (req, res, next) => {
    const id = req.params.id;   // Id Album

    const track = req.body.track || null;

    if (!track) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    //
    // Controllo se l'Album Track Esiste
    //
    const result = await controller.getOneTrack(id, track, req)
        .catch(error => {
            throw error;
        });

    try {
        if (result) {
            return res.status(409).json(
                api.simpleResponse(req, 409, "Album Track Already Exists")
            );
        }
    } catch (error) {
        throw error;
    }

    //
    // Creo l'Album Track
    //
    const data = {
        track,  // Id Traccia
    };

    await controller.createTrack(id, data)
        .catch(error => {
            throw error
        });

    //
    // Restituisco l'Album Track
    //
    const response = await controller.getOneTrack(id, track, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(201).json(
            api.simpleResponse(req, 201, "Album Track Created", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Update Album Track
 */
router.put("/albums/:id/tracks/:track", authPlus, async (req, res, next) => {
    const id = req.params.id;       // Id Album
    const track = req.params.track; // Id Traccia

    //
    // Controllo se l'Album Track Esiste
    //
    const result = await controller.getOneTrack(id, track, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!result) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "Album Track Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    //
    // Modifico l'Album Track
    //
    const data = {

    };

    await controller.updateTrack(id, track, data)
        .catch(error => {
            throw error;
        });

    //
    // Restituisco l'Album Track
    //
    const response = await controller.getOne(id, track, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(200).json(
            api.simpleResponse(req, 200, "Album Track Updated", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Delete Album Track
 */
router.delete("/albums/:id/tracks/:track", authPlus, async (req, res, next) => {
    const id = req.params.id;       // Id Album
    const track = req.params.track; // Id Traccia

    const response = await controller.getOneTrack(id, track, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!response) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "Album Track Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    await controller.removeTrack(id, track)
        .catch(error => {
            throw error;
        });

    return res.status(204).json(
        api.simpleResponse(req, 204, "Album Track Deleted", response)
    );
});



/**
 * Create Album Artist
 */
router.post("/albums/:id/artists", authPlus, async (req, res, next) => {
    const id = req.params.id;   // Id Album

    const artist = req.body.artist || null;

    if (!artist) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    //
    // Controllo se l'Album Artist Esiste
    //
    const result = await controller.getOneArtist(id, artist, req)
        .catch(error => {
            throw error;
        });

    try {
        if (result) {
            return res.status(409).json(
                api.simpleResponse(req, 409, "Album Artist Already Exists")
            );
        }
    } catch (error) {
        throw error;
    }

    //
    // Creo l'Album Artist
    //
    const data = {
        artist,  // Id Traccia
    };

    await controller.createArtist(id, data)
        .catch(error => {
            throw error
        });

    //
    // Restituisco l'Album Artist
    //
    const response = await controller.getOneArtist(id, artist, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(201).json(
            api.simpleResponse(req, 201, "Album Artist Created", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Update Album Artist
 */
router.put("/albums/:id/artists/:artist", authPlus, async (req, res, next) => {
    const id = req.params.id;       // Id Album
    const artist = req.params.artist; // Id Traccia

    //
    // Controllo se l'Album Artist Esiste
    //
    const result = await controller.getOneArtist(id, artist, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!result) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "Album Artist Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    //
    // Modifico l'Album Artist
    //
    const data = {

    };

    await controller.updateArtist(id, artist, data)
        .catch(error => {
            throw error;
        });

    //
    // Restituisco l'Album Artist
    //
    const response = await controller.getOne(id, artist, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(200).json(
            api.simpleResponse(req, 200, "Album Artist Updated", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Delete Album Artist
 */
router.delete("/albums/:id/artists/:artist", authPlus, async (req, res, next) => {
    const id = req.params.id;       // Id Album
    const artist = req.params.artist; // Id Traccia

    const response = await controller.getOneArtist(id, artist, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!response) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "Album Artist Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    await controller.removeArtist(id, artist)
        .catch(error => {
            throw error;
        });

    return res.status(204).json(
        api.simpleResponse(req, 204, "Album Artist Deleted", response)
    );
});

module.exports = router;
