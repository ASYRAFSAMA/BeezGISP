const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Database connection
const pool = new Pool({
    user: 'yourusername',
    host: 'localhost',
    database: 'yourdatabase',
    password: 'yourpassword',
    port: 5432,
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle customer registration
app.post('/register', async (req, res) => {
    const { customername, customeremail, customerpassword, customerdob, customerphonenum, customeraddress } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO customer (customername, customeremail, customerpassword, customerdob, customerphonenum, customeraddress) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [customername, customeremail, customerpassword, customerdob, customerphonenum, customeraddress]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in /register route:', err);
        res.status(500).send('Failed to register customer.');
    }
});

// Define a route to test the database connection
app.get('/time', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
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
