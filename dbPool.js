const mysql = require('mysql');

// fill in database values
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "host_name",
    user: "user_name",
    password: "password",
    database: "database"
});

module.exports = pool;
