var orm = require("../config/orm.js");

var solace = {
    createAclProfile: function(user,pass,vpn,app,desc,type,cb){
        orm.createAclProfile(user,pass,vpn,app,desc,type,function(res){
            console.log("Request: Create ACL Profile --> " + app+"_"+desc+"_"+type+"_acl; Status Code: " + res.body.meta.responseCode);
            cb(res);
        })
    },
    createClientUsername: function(user,pass,vpn,app,desc,type,cb){
        orm.createClientUsername(user,pass,vpn,app,desc,type,function(res){
            console.log("Request: Create Client Username --> " + app+"_"+desc+"_"+type+"_acl; Status Code: " + res.body.meta.responseCode);
            cb(res);
        })
    }
}
module.exports = solace;