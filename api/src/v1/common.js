/**
 * Dizzie REST API
 *
 * An Open-Source Playlist Service
 *
 * https://github.com/reallukee/dizzie
 *
 * Author       : Luca Pollicino
 * Descrizione  : COMMON
 * License      : MIT
 * Versione     : 1.0.0
 */

module.exports = {
    version: 1,
    role: {
        owner: "owner",
        admin: "admin",
        user: "user",
        guest: "guest",
        test: "test",
    },
    visibility: {
        private: "private",
        hidden: "hidden",
        public: "public",
    },
    playlist: {
        user: "user",
        default: "default",
        system: "system",
    },
};
