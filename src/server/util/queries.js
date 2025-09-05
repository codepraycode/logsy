/* 
    This file is to store all the query commands we're to run in the app
 */


const createTableQuery = `
    CREATE TABLE IF NOT EXISTS logs (
      id DOUBLE PRIMARY KEY,
      type TEXT,
      timestamp TEXT,
      photoPath TEXT
    );

`

const insetClockDataQuery = "INSERT INTO logs (id, type, timestamp, photoPath) VALUES (?, ?, ?, ?)"
const fetchAllClockDataQuery = `SELECT * FROM logs`
const fetchClockDataQuery = `
    SELECT * FROM logs
    WHERE timestamp BETWEEN ? AND ?
    ORDER BY timestamp DESC
  `

module.exports = {
    createTableQuery,
    insetClockDataQuery,
  fetchAllClockDataQuery,
    fetchClockDataQuery
}