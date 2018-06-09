// require the orm object
var orm = require("../config/orm.js");

// define the database object
var database = {
    // abstracted select * statement
    selectAll: function(cb){
        orm.selectAll(function(res){
            cb(res);
        });
    },
    // abstracted insert statement
    insertOne: function(vpn, app, desc, cb){
        orm.insertOne(vpn,app,desc,function(res){
            cb(res);
        });
    }
};

// export the database object
module.exports = database;