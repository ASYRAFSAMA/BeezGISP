
const { Pool } = require('pg');
const dotenv = require('dotenv');

const pool = new Pool({
  max: 10, // connection limit
  host: 'caij57unh724n3.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
  user: 'ua4egv33qg6g91',
  password: 'pea53831c106e5b4af738cb09605bd1e8232140cbf39cf22e2ed0475e112ab8f8',
  database: 'ddggum3j7vputj',
  port: 5432, // default PostgreSQL port
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the database');
    release(); // Release the client back to the pool
  }
});

module.exports = {
  pool: pool,
  query: (text, params) => pool.query(text, params),
};