require("dotenv").config();
const { Pool } = require("pg");






module.exports = new Pool({
 connectionString:DATABASE_URL

});
