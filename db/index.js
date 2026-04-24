const { Pool, types } = require('pg');
require('dotenv').config();

// Override the default date parser to return date strings instead of JavaScript Date objects.
types.setTypeParser(1082, (val) => val);

//Single shared pool instance for the entire application
const pool = new Pool();

module.exports = pool;
