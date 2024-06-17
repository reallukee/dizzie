/**
 * Dizzie REST API
 *
 * https://github.com/reallukee/dizzie
 *
 * Author   : Luca Pollicino
 * License  : MIT
 */

const express = require("express");             // Express
const cors = require("cors");                   // Cors
const cookieParser = require("cookie-parser");  // CookieParser
const dotenv = require("dotenv");               // DotEnv

dotenv.config();

const app = express()
    .use(express.json())
    .use(express.urlencoded({ extended: true, }))
    .use("*", cors())
    .use("/", express.static("www"))
    .use(cookieParser())
    .set("view engine", "ejs");

app.set("json spaces", 2);

const port = process.env.PORT || 4040;              // Port
const hostname = process.env.HOSTNAME || "0.0.0.0"; // Hostname

const apiPort = process.env.API_PORT || 4044;               // API Port
const apiHostname = process.env.API_HOSTNAME || "0.0.0.0";  // API Hostname

app.get("/", async (req, res, next) => {
    return res.render("home");
});

app.get("/signin", async (req, res, next) => {
    return res.render("signin");
});

app.get("/signup", async (req, res, next) => {
    return res.render("signup");
});

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});
