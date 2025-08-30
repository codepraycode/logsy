/* 
    This file is to store all the query commands we're to run in the app
 */


const createTableQuery = `
    CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    timestamp TEXT,
    photo TEXT
  )
`

const insetClockDataQuery = `INSERT INTO logs (name, type, timestamp, photo) VALUES (?, ?, ?, ?)`
const fetchClockDataQuery = `
    SELECT * FROM logs
    WHERE timestamp BETWEEN ? AND ?
    ORDER BY timestamp DESC
  `

module.exports = {
    createTableQuery,
    insetClockDataQuery,
    fetchClockDataQuery
}