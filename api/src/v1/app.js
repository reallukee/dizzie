/**
 * Dizzie REST API
 *
 * https://github.com/reallukee/dizzie
 *
 * Author   : Luca Pollicino
 * License  : MIT
 */

const express = require("express"); // Epxress

const common = require("./common"); // Common
const db = require("./db");         // Database
const api = require("./api");       // API

const router = new express.Router();

router.use(require("./middlewares/query"));     // Query
router.use(require("./middlewares/log"));       // Log

router.use("/v1", require("./routes/user"));    // User

router.use(require("./middlewares/error"));     // Error

router.get("/v1", async (req, res, next) => {
    return res.status(200).json(
        api.simpleResponse(req, 200, "OK")
    );
});

router.get("/v1/*", async (req, res, next) => {
    return res.status(404).json(
        api.simpleResponse(req, 200, "Not Found")
    );
});

module.exports = router;
