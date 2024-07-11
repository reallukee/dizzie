/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 * Descrizione  : CONFIG
 * License      : MIT
 * Versione     : 1.0.0
 */

const fs = require("fs");           // FileSystem
const mysql2 = require("mysql2");   // MySQL2
const dotenv = require("dotenv");   // DotEnv

const common = require("../common");    // Common
const db = require("../db");            // Database
const api = require("../api");          // API

dotenv.config();

const main = async () => {
    const sql = await fs.readFile("dizzie.sql")
        .catch(error => {
            throw error;
        });
};

main()
    .catch(error => {
        console.error(error);
    });
