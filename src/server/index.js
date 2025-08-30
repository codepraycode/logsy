const express = require("express");
const cors = require('cors');
const db = require('./db');
const path = require('path');
const fs = require('fs');
const { insetClockDataQuery, fetchClockDataQuery } = require("./util/queries");


const app = express();
const PORT = 3020;


app.use(cors());
app.use(express.json());
app.use(express.static('client'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// API endpoints

// Post clock in or clock out
app.post('/api/clock', upload.single('photo'), (req, res) => {
    const { name, type } = req.body;
    const timestamp = new Date().toISOString();
    const photoPath = `/uploads/${req.file.filename}`;

    db.prepare(insetClockDataQuery)
        .run(name, type, timestamp, photoPath);

    res.json({ success: true });
});


// Get all clock in and clock out
app.get('/api/logs', (req, res) => {
    const { from, to } = req.query;

    const logs = db.prepare(fetchClockDataQuery).all(from, to);

    res.json(logs);
});
