var orm = require("../config/orm.js");

var database = {
    selectAll: function(cb){
        orm.selectAll(function(res){
            cb(res);
        });
    },
    insertOne: function(vpn, app, desc, cb){
        orm.insertOne(vpn,app,desc,function(res){
            cb(res);
        });
    }
};

module.exports = database;