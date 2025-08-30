const Database = require("better-sqlite3");
const { createTableQuery } = require("./util/queries");

const db = new Database("logsy.db");

db.prepare(createTableQuery).run();

module.exports = db;


