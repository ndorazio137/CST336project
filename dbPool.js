const mysql = require('mysql');

// fill in database values
// Probably needs "npm i request --save" package installed.
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "host_name",
    user: "user_name",
    password: "password",
    database: "database"
});

module.exports = pool;
