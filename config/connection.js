// require mysql, orm and dotenv
// dotenv is used to protect plaintext passwords from GITHUB
var mysql = require('mysql');
require('dotenv').config();

// define connection object
var connection;

// if the JAWSDB_URL environment variable is set, then use it
if(process.env.JAWSDB_URL){
    connection = mysql.createConnection(process.env.JAWSDB_URL)
}

// otherwise, use the definitions provided in the .env file
else{
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB
    });
}

// connect to the database
connection.connect(function(error){
    var orm = require("./orm")
    if(error){
        orm.log("error logging into the database: " + error.stack);
        return
    }
    orm.log("connected as id " + connection.threadId )
});

// export the connection
module.exports = connection;