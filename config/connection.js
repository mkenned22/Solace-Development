var mysql = require('mysql');
require('dotenv').config();

var connection;

if(process.env.JAWSDB_URL){
    connection = mysql.createConnection(process.env.JAWSDB_URL)
}
else{
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB
    });
}

connection.connect(function(error){
    if(error){
        console.log("error logging into the database: " + error.stack);
        return
    }
    console.log("connected as id " + connection.threadId )
});

module.exports = connection;