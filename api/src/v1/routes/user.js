/**
 * Dizzie REST API
 *
 * https://github.com/reallukee/dizzie
 *
 * Author   : Luca Pollicino
 * License  : MIT
 */

const express = require("express");     // Express

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

const controller = require("../controllers/user");  // Controller

const { authView } = require("../middlewares/auth");        // AuthView
const { auth } = require("../middlewares/auth");            // Auth
const { authPlus } = require("../middlewares/auth");        // AuthPlus

const pagination = require("../middlewares/pagination");    // Pagination

const router = express.Router();

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
            api.dataResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

/**
 * Get One User
 */
router.get("/users/:id", authView, async (req, res, next) => {
    const id = req.params.id;

    const response = await controller.getOne(req, id)
        .catch(error => {
            throw error;
        });
    
    try {
        const status = response ? 200 : 404;
        const message = status === 200 ? "OK" : "User Not Found";

        return res.status(200).json(
            api.dataResponse(req, status, message, response)
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
            api.dataResponse(req, 400, "Invalid Body")
        );
    }

    const id = username;

    const result = await controller.getOne(req, id)
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
        username,
        password,
        role,
    };

    await controller.create(data)
        .catch(error => {
            throw error;
        });

    return res.status(201).json(
        api.simpleResponse(req, 201, "User Created")
    );
});

/**
 * Update User
 */
router.put("/users/:id", authPlus, async (req, res, next) => {
    const id = req.params.id;

    const result = await controller.getOne(req, id)
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

    const username = req.body.username || result.username;
    const password = req.body.password || result.password;
    const role = req.body.role || result.role;

    if (!username || !password || !role) {
        return res.status(400).json(
            api.dataResponse(req, 400, "Invalid Body")
        );
    }

    const data = {
        username,
        password,
        role,
    };

    await controller.update(id, data)
        .catch(error => {
            throw error;
        });

    return res.status(200).json(
        api.simpleResponse(req, 200, "User Updated")
    );
});

/**
 * Delete User
 */
router.delete("/users/:id", authPlus, async (req, res, next) => {
    const id = req.params.id;

    const result = controller.getOne(req, id)
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

    await controller.remove(id)
        .catch(error => {
            throw error;
        });

    return res.status(200).json(
        api.simpleResponse(req, 204, "User Deleted")
    );
});

module.exports = router;
