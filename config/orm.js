var request = require("request");
var api = "mr-91b69336gh.messaging.solace.cloud:20270/SEMP/v2/config";
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
            cb(res.statusCode); 
        });
    },
    createClientUsername: function(){

    }
}

module.exports = orm;