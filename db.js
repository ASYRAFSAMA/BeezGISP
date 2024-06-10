const { Pool } = require('pg');

const pool = new Pool({
  user: 'ua4egv33qg6g91',
  host: 'caij57unh724n3.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
  database: 'ddggum3j7vputj',
  password: 'pea53831c106e5b4af738cb09605bd1e8232140cbf39cf22e2ed0475e112ab8f8',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
