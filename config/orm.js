var request = require("request");
var api = "vmr-mrukojm0fl.messaging.solace.cloud:21230/SEMP/v2/config";
var orm = {
    
    createAclProfile: function(user,pass,vpn,app,desc,type,cb){
        var params = {
            uri: "https://"+user+":"+pass+"@"+api+"/msgVpns/"+vpn+"/aclProfiles",
            method: 'POST',
            json: { 
                "aclProfileName":app+"_"+desc+"_"+type+"_acl",
                "clientConnectDefaultAction":"allow"
            }
        }

        if(type="pub"){
            params.json.publishTopicDefaultAction = "allow";
        }
        else if(type="sub"){
            params.json.subscribeTopicDefaultAction = "allow";
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
            }
        };

        if(type="pub"){
            params.json.password = "publish";
        }
        else if(type="sub"){
            params.json.password = "subscribe";
        }

        request(params,function(error,res,body){
            if(error){
                throw error
            }
            cb(res); 
        });
    }
}

module.exports = orm;