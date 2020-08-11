const mysql = require('mysql');

// fill in database values. Using a testing database right now for login screen.
// KYLE: please change to real database when ready!
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "u28rhuskh0x5paau.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xm4m5ktv0aw09ru9",
    password: "uw6a2g99gu0qrvya",
    database: "hqa04g4sl9lm5mu3"
});

module.exports = pool;
