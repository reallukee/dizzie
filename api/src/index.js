/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 *                (https://github.com/reallukee)
 * Descrizione  : INDEX
 * License      : MIT
 *                (https://opensource.org/license/mit)
 * Versione     : 1.0.0
 */

const express = require("express"); // Express
const cors = require("cors");       // Cors
const dotenv = require("dotenv");   // DotEnv

const common = require("./common"); // Common
const db = require("./db");         // Database
const api = require("./api");       // API

const { version } = require("./common");    // Version

dotenv.config();

const app = express()
    .use(express.json())
    .use(express.urlencoded({ extended: true, }))
    .use("*", cors());

app.set("json spaces", 2);

const port = process.env.PORT || 4044;              // Port
const hostname = process.env.HOSTNAME || "0.0.0.0"; // Hostname

const secret = process.env.SECRET || "1234";        // Secret

app.use(require("./middlewares/query"));            // Query
app.use(require("./middlewares/log"));              // Log

app.use("/api/v1", require("./routes/user"));       // Users
//app.use("/api/v1", require("./routes/playlist"));   // Playlists
app.use("/api/v1", require("./routes/service"));    // Services
app.use("/api/v1", require("./routes/album"));      // Albums
app.use("/api/v1", require("./routes/artist"));     // Artists
app.use("/api/v1", require("./routes/track"));      // Tracks

app.use(require("./middlewares/error"));            // Error

app.get("/v1", async (req, res, next) => {
    const response = {
        version,
        internalVersion: "1.0.0@06302024",
        status: "development",
    };

    return res.status(200).json(
        api.simpleResponse(req, 200, "OK", response)
    );
});

app.get("/v1/*", async (req, res, next) => {
    return res.status(404).json(
        api.simpleResponse(req, 404, "EndPoint Not Found")
    );
});

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});
