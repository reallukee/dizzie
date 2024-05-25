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

const controller = require("../controllers/auth");  // Controller

const user = require("../controllers/user");        // User Controllore

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
            api.dataResponse(req, 400, "Invalid Body")
        );
    }

    const id = username;

    const result = await user.getOne(req, id)
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
    };

    await controller.signup(data)
        .catch(error => {
            throw error;
        });

    return res.status(201).json(
        api.simpleResponse(req, 201, "User Created")
    );
});

/**
 * User Sign In
 */
router.post("/signin", async (req, res, next) => {
    const username = req.body.username || null;
    const password = req.body.password || null;

    if (!username || !password) {
        return res.status(400).json(
            api.dataResponse(req, 400, "Invalid Body")
        );
    }

    const data = {
        username,
        password,
    };

    const response = await controller.signin(data)
        .catch(error => {
            throw error;
        });

    if (!response) {
        return res.status(401).json(
            api.simpleResponse(req, 401, "Unauthorized")
        );
    }

    return res.status(200).json(
        api.dataResponse(req, 200, "OK", response)
    );
});

module.exports = router;
