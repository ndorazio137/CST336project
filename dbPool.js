const mysql = require('mysql');

// fill in database values. Using a testing database right now for login screen.
// KYLE: please change to real database when ready!
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "rnr56s6e2uk326pj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "e2ixdlaj1rh29g8c",
    password: "kl48kn2bpr9az7bg",
    database: "fgnom3yhwunht73d"
});

module.exports = pool;
