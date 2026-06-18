require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT player_name, score, level_reached, played_at FROM leaderboard ORDER BY score DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error Database GET:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/leaderboard', async (req, res) => {
    const { playerName, score, levelReached } = req.body;
    try {
        await pool.query(
            'INSERT INTO leaderboard (player_name, score, level_reached) VALUES ($1, $2, $3)',
            [playerName, score, levelReached]
        );
        res.status(201).json({ message: 'Success' });
    } catch (err) {
        console.error("Error Database POST:", err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
module.exports = app;
