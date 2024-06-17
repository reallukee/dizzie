/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 * Descrizione  : USER
 *                Metodi per la Gestione della Risorsa 'User'
 *                e delle Risorse a Esso Collegate
 * License      : MIT
 * Versione     : 1.0.0
 */

const express = require("express");     // Express

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

const controller = require("../controllers/user");          // Controller

const { authView } = require("../middlewares/auth");        // AuthView
const { auth } = require("../middlewares/auth");            // Auth
const { authPlus } = require("../middlewares/auth");        // AuthPlus

const pagination = require("../middlewares/pagination");    // Pagination

const router = express.Router();

/**
 * User Sign Up
 */
router.post("/signup", async (req, res, next) => {
    const username = req.body.username || null;
    const password = req.body.password || null;

    if (!username || !password) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    const result = await controller.getOne(username, req)
        .catch(error => {
            throw error;
        });

    try {
        if (result) {
            return res.status(409).json(
                api.simpleResponse(req, 409, "User Already Exists")
            );
        }
    } catch (error) {
        throw error;
    }

    const data = {
        username,   // Username Utente
        password,   // Password Utente
    };

    await controller.signup(data)
        .catch(error => {
            throw error;
        });

    const response = await controller.getOne(id)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(201).json(
            api.simpleResponse(req, 201, "User Created", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * User Sign In
 */
router.post("/signin", async (req, res, next) => {
    const username = req.body.username || null;
    const password = req.body.password || null;

    if (!username || !password) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    const result = await controller.getOne(username, req)
        .catch(error => {
            throw error;
        });
    
    try {
        if (result) {
            return res.status(409).json(
                api.simpleResponse(req, 409, "User Already Exists")
            );
        }
    } catch (error) {
        throw error;
    }

    const data = {
        username,   // Username Utente
        password,   // Password Utente
    };

    const response = await controller.signin(data)
        .catch(error => {
            throw error;
        });

    try {
        const status = response ? 200 : 401;
        const message = status === 200 ? "OK" : "Unauthorized";

        return res.status(status).json(
            api.simpleResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});



/**
 * Get All Users
 */
router.get("/users", authView, pagination, async (req, res, next) => {
    const response = await controller.getAll(req)
        .catch(error => {
            throw error;
        });

    try {
        const status = response.lenght === 0 ? 204 : 200;
        const message = status === 200 ? "OK" : "No Users";

        return res.status(200).json(
            api.simpleResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Get One User
 */
router.get("/users/:id", authView, async (req, res, next) => {
    const id = req.params.id;   // Username Utente

    const response = await controller.getOne(id)
        .catch(error => {
            throw error;
        });

    try {
        const status = response ? 200 : 404;
        const message = status === 200 ? "OK" : "User Not Found";

        return res.status(status).json(
            api.simpleResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Create User
 */
router.post("/users", authPlus, async (req, res, next) => {
    const username = req.body.username || null;
    const password = req.body.password || null;
    const role = req.body.role || null;

    if (!username || !password || !role) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    //
    // Controllo se l'Utente Esiste
    //
    const result = await controller.getOne(username, req)
        .catch(error => {
            throw error;
        });

    try {
        if (result) {
            return res.status(409).json(
                api.simpleResponse(req, 409, "User Already Exists")
            );
        }
    } catch (error) {
        throw error;
    }

    //
    // Creo l'Utente
    //
    const data = {
        username,   // Username Utente
        password,   // Password Utente
        role,       // Ruolo Utente
    };

    await controller.create(data)
        .catch(error => {
            throw error;
        });

    //
    // Restituisco l'Utente
    //
    const response = await controller.getOne(username, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(201).json(
            api.simpleResponse(req, 201, "User Created", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Update User
 */
router.put("/users/:id", authPlus, async (req, res, next) => {
    const id = req.params.id;   // Username Utente

    //
    // Controllo se l'Utente Esiste
    //
    const result = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!result) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "User Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    //
    // Modifico l'Utente
    //
    const password = req.body.password || result.password;
    const role = req.body.role || result.role;

    if (!password || !role) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    const data = {
        password,   // Password Utente
        role,       // Ruolo Utente
    };

    await controller.update(id, data)
        .catch(error => {
            throw error;
        });

    //
    // Restituisco l'Utente
    //
    const response = await controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(200).json(
            api.simpleResponse(req, 200, "User Updated", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Delete User
 */
router.delete("/users/:id", authPlus, async (req, res, next) => {
    const id = req.params.id;   // Username Utente

    const response = controller.getOne(id, req)
        .catch(error => {
            throw error;
        });

    try {
        if (!response) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "User Not Found")
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
        api.simpleResponse(req, 204, "User Deleted", response)
    );
});



/**
 * Get Me
 */
router.get("/me", authView, async (req, res, next) => {
    const id = res.locals.payload.username;

    const response = await controller.getOne(id)
        .catch(error => {
            throw error;
        });

    try {
        const status = response ? 200 : 404;
        const message = status === 200 ? "OK" : "User Not Found";

        return res.status(200).json(
            api.simpleResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Update Me
 */
router.put("/me", auth, async (req, res, next) => {
    const id = res.locals.payload.username;

    const result = await controller.getOne(id)
        .catch(error => {
            throw error;
        });

    try {
        if (!result) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "User Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    const password = req.body.password || result.password;
    const role = result.role;

    if (!password || !role) {
        return res.status(400).json(
            api.simpleResponse(req, 400, "Invalid Body")
        );
    }

    const data = {
        password,
        role,
    };

    await controller.update(id, data)
        .catch(error => {
            throw error;
        });

    const response = await controller.getOne(id)
        .catch(error => {
            throw error;
        });

    try {
        return res.status(200).json(
            api.simpleResponse(req, 200, "User Updated", response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Delete Me
 */
router.delete("/me", auth, async (req, res, next) => {
    const id = res.locals.payload.username;

    const response = controller.getOne(id)
        .catch(error => {
            throw error;
        });

    try {
        if (!response) {
            return res.status(404).json(
                api.simpleResponse(req, 404, "User Not Found")
            );
        }
    } catch (error) {
        throw error;
    }

    await controller.remove(id)
        .catch(error => {
            throw error;
        });

    return res.status(200).json(
        api.simpleResponse(req, 204, "User Deleted", response)
    );
});

module.exports = router;
