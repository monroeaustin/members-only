require("dotenv").config();
const { Pool } = require("pg");






const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.CONNECTION,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
