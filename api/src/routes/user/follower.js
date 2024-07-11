/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 *                (https://github.com/reallukee)
 * Descrizione  : USER FOLLOWER
 *                Metodi per la Gestione della Risorsa 'User Follower'
 *                e delle Risorse a Esso Collegate
 * License      : MIT
 *                (https://opensource.org/license/mit)
 * Versione     : 1.0.0
 */

const express = require("express");     // Express

const common = require("../../common"); // Common
const db = require("../../db");         // Database
const api = require("../../api");       // API

const controller = require("../../controllers/user/follower");  // Controller

const { authView } = require("../../middlewares/auth");         // AuthView
const { auth } = require("../../middlewares/auth");             // Auth
const { authPlus } = require("../../middlewares/auth");         // AuthPlus

const pagination = require("../../middlewares/pagination");     // Pagination

const router = express.Router();

/**
 * Get All User Followers
 */
router.get("/users/:user/followers", authView, pagination, async (req, res, next) => {
    const user = req.params.user;   // Username Utente
    
    const response = await controller.getAll(user, req)
        .catch(error => {
            throw error;
        });

    try {
        const status = response.length === 0 ? 204 : 200;
        const message = status === 200 ? "OK" : "No User Followers";

        return res.status(200).json(
            api.simpleResponse(req, status, message, response)
        );
    } catch (error) {
        throw error;
    }
});

module.exports = router;
