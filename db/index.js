const { Pool } = require('pg');
require('dotenv').config();

//Single shared pool instance for the entire application
const pool = new Pool();

module.exports = pool;
