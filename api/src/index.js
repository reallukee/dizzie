/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 * Descrizione  : INDEX
 * License      : MIT
 * Versione     : 1.0.0
 */

const express = require("express"); // Express
const cors = require("cors");       // Cors
const dotenv = require("dotenv");   // DotEnv

dotenv.config();

const app = express()
    .use(express.json())
    .use(express.urlencoded({ extended: true, }))
    .use("*", cors());

app.set("json spaces", 2);

const port = process.env.PORT || 4044;              // Port
const hostname = process.env.HOSTNAME || "0.0.0.0"; // Hostname

app.use("/api", require("./v1/app"));

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});
