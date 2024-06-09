const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle user registration
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Assuming you have a table named 'users' with columns 'username', 'email', 'password'
        const result = await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, password]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in /register route:', err);
        res.status(500).send('Failed to register user.');
    }
});

// Define a route to test the database connection
app.get('/time', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in /time route:', err);
        res.status(500).send('Something went wrong!');
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
