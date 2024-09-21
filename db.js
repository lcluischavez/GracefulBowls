//create sql connection
const { Pool } = require('pg');

const pool = new Pool({
  host: 'postres-1.csnmnet6zree.us-east-1.rds.amazonaws.com',
  user: 'postgres',
  password: 'Matrixtate',
  database: 'postgres',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database!');
});

module.exports = pool;