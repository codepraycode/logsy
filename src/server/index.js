const express = require("express");
const cors = require('cors');
const { initDB } = require('./db');
const path = require('path');
const upload = require("./util/upload");
const { insetClockDataQuery, fetchClockDataQuery, fetchAllClockDataQuery } = require("./util/queries");

const app = express();
const PORT = 3020;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve main client page at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Initialize DB and start server
initDB().then((db) => {
    console.log('✅ DuckDB initialized.');

    app.get('/api/status', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime_seconds: process.uptime(),
        });
    });

    app.post('/api/clock', upload.single('photo'), async (req, res) => {
        try {
            const { type } = req.body;
            const timestamp = new Date().toISOString();
            const photoPath = req.file ? `/uploads/${req.file.filename}` : '';

            const id = new Date().getTime();

            await db.run(insetClockDataQuery, id, type, timestamp, photoPath);

            res.json({ success: true });
        } catch (err) {
            console.error('❌ Failed to insert log:', err);
            res.status(500).json({ error: 'Failed to insert log' });
        }
    });



    app.get('/api/logs', async (req, res) => {
        const { from, to } = req.query;

        let sql = 'SELECT * FROM logs';
        const params = [];
        const conditions = [];

        if (from) {
            conditions.push('timestamp >= ?');
            params.push(from);
        }

        if (to) {
            conditions.push('timestamp <= ?');
            params.push(to);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY timestamp DESC';

        try {
            const rows = params.length > 0
                ? await db.all(sql, params)
                : await db.all(sql); // 👈 No params passed if not needed
            // console.debug({rows})
            res.json({message:"Fetched all logs", data:rows});
        } catch (err) {
            console.error('❌ Failed to fetch logs:', err);
            res.status(500).json({ error: 'Failed to fetch logs' });
        }
    });






    app.listen(PORT, () => {
        console.log(`🚀 Logsy running at http://localhost:${PORT}`);
    });

}).catch((err) => {
    console.error('❌ Failed to initialize DB:', err);
});
