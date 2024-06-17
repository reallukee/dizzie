/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 * Descrizione  : APP
 * License      : MIT
 * Versione     : 1.0.0
 */

const express = require("express"); // Epxress

const common = require("./common"); // Common
const db = require("./db");         // Database
const api = require("./api");       // API

const router = new express.Router();

router.use(require("./middlewares/query"));     // Query
router.use(require("./middlewares/log"));       // Log

router.use("/v1", require("./routes/user"));    // Users
router.use("/v1", require("./routes/service")); // Services
router.use("/v1", require("./routes/album"));   // Albums
router.use("/v1", require("./routes/artist"));  // Artists
router.use("/v1", require("./routes/track"));   // Tracks

router.use(require("./middlewares/error"));     // Error

router.get("/v1", async (req, res, next) => {
    return res.status(200).json(
        api.simpleResponse(req, 200, "OK")
    );
});

router.get("/v1/*", async (req, res, next) => {
    return res.status(404).json(
        api.simpleResponse(req, 404, "EndPoint Not Found")
    );
});

module.exports = router;
