// require request and the mysql "connection" object
var request = require("request");
var connection = require("./connection.js");

// define the SEMP API URL
var api = "vmr-mrukojm0fl.messaging.solace.cloud:21230/SEMP/v2/config";

// define the orm object
var orm = {
    // SOLACE FUNCTIONS
    // create an ACL profile
    createAclProfile: function(user,pass,vpn,app,desc,type,cb){
        // POST params
        var params = {
            uri: "https://"+user+":"+pass+"@"+api+"/msgVpns/"+vpn+"/aclProfiles",
            method: 'POST',
            json: { 
                "aclProfileName":app+"_"+desc+"_"+type+"_acl",
                "clientConnectDefaultAction":"allow",
                "subscribeTopicDefaultAction":"allow",
                "publishTopicDefaultAction":"allow"
            }
        }
        // request
        request(params,function(error,res,body){
            if(error){
                orm.log(error);
            }
            cb(res); 
        });
    },

    // create a client username
    createClientUsername: function(user,pass,vpn,app,desc,type,cb){
        // POST params
        var params = {
            uri: "https://"+user+":"+pass+"@"+api+"/msgVpns/"+vpn+"/clientUsernames",
            method: 'POST',
            json: {
                "clientUsername":app+"_"+desc+"_"+type+"_cu",
                "aclProfileName":app+"_"+desc+"_"+type+"_acl",
                "clientProfileName":"default",
                "enabled":true,
                "password":type+'_password'
            }
        };
        // request
        request(params,function(error,res,body){
            if(error){
                orm.log(error);
            }
            cb(res); 
        });
    },
    // END SOLACE FUNCTIONS
    ///////////////////////

    // DATABASE FUNCTIONS
    // select all entries in the database
    selectAll: function(cb){
        query = "select * from request_log";
        connection.query(query, function(error, result){
            if(error){
                orm.log(error);
            }
            cb(result);
        });
    },
    // insert a new entry into the database
    insertOne: function(vpn, app, desc, cb){
        query = 'insert into request_log (msgvpn,app,description) values ("'+vpn+'","'+app+'","'+desc+'")' + ';';
        connection.query(query, function(error, result){
            if(error){
                orm.log(error);
            }
            cb(result);
        });
    },
    // END DATABASE FUNCTIONS
    /////////////////////////

    // MISCELLANEOUS
    // creating a custom logger which throws a timestamp in front of the log message
    log: function (line) {
        var now = new Date();
        var time = [('0' + now.getHours()).slice(-2), ('0' + now.getMinutes()).slice(-2),
            ('0' + now.getSeconds()).slice(-2)];
        var timestamp = '[' + time.join(':') + '] ';
        console.log(timestamp + line);
    }   
}

// export the orm object
module.exports = orm;