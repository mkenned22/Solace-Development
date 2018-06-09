var request = require("request");
var connection = require("./connection.js");
var api = "vmr-mrukojm0fl.messaging.solace.cloud:21230/SEMP/v2/config";
var orm = {
    
    createAclProfile: function(user,pass,vpn,app,desc,type,cb){
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

        request(params,function(error,res,body){
            if(error){
                throw error
            }
            cb(res); 
        });
    },
    createClientUsername: function(user,pass,vpn,app,desc,type,cb){
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

        request(params,function(error,res,body){
            if(error){
                throw error
            }
            cb(res); 
        });
    },
    selectAll: function(cb){
        query = "select * from request_log";
        connection.query(query, function(error, result){
            if(error){
                throw error;
            }
            cb(result);
        });
    },
    insertOne: function(vpn, app, desc, cb){
        query = 'insert into request_log (msgvpn,app,description) values ("'+vpn+'","'+app+'","'+desc+'")' + ';';
        connection.query(query, function(error, result){
            if(error){
                throw error;
            }
            cb(result);
        });
    }
}

module.exports = orm;