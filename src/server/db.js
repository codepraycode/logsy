const { Database } = require('duckdb-async');
const path = require('path');
const { createTableQuery } = require('./util/queries');

const dbPath = path.join(__dirname, '../../logsy.duckdb');

// let db; // Declare once to reuse across the app

const initDB = async () => {
    db = await Database.create(dbPath);
    await db.run(createTableQuery);
    return db;
};

module.exports = { initDB };
