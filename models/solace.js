var orm = require("../config/orm.js");

var solace = {
    createAclProfile: function(user,pass,vpn,app,desc,type,cb){
        orm.createAclProfile(user,pass,vpn,app,desc,type,function(res){
            cb(res);
        })
    }
}
module.exports = solace;