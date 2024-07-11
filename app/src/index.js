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

const express = require("express");         // Express
const session = require("express-session"); // Express Session
const crypto = require("crypto");           // Crypto
const cors = require("cors");               // Cors
const dotenv = require("dotenv");           // DotEnv

dotenv.config();

const app = express()
    .use(express.json())
    .use(express.urlencoded({ extended: true, }))
    .use("*", cors())
    .use("/", express.static("www"))
    .set("view engine", "ejs");

app.set("json spaces", 2);

const port = process.env.PORT || 4040;                      // Port
const hostname = process.env.HOSTNAME || "0.0.0.0";         // Hostname

const apiPort = process.env.API_PORT || 4044;               // API Port
const apiHostname = process.env.API_HOSTNAME || "0.0.0.0";  // API Hostname

const secret = process.env.SECRET || "1234";                // Secret

const options = {
    secret,
};

app.use(session(options));

app.get("/", async (req, res, next) => {
    return res.render("home");
});

app.get("/signin", async (req, res, next) => {
    return res.render("signin");
});

app.get("/signup", async (req, res, next) => {
    return res.render("signup");
});

app.get("/profile", async (req, res, next) => {
    return res.render("profile");
});

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});
