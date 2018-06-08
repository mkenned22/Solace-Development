var orm = require("../config/orm.js");

var solace = {
    configureMessageVpn: function(user,pass,vpn,app,desc,cb){
        orm.createAclProfile(user,pass,vpn,app,desc,"pub",function(result){
            if(result.body.meta.responseCode === 200){
                orm.createAclProfile(user,pass,vpn,app,desc,"sub",function(result){
                    if(result.body.meta.responseCode === 200){
                        orm.createClientUsername(user,pass,vpn,app,desc,"pub",function(result){
                            if(result.body.meta.responseCode === 200){
                                orm.createClientUsername(user,pass,vpn,app,desc,"sub",function(result){
                                    cb(result);
                                });
                            }
                            else{
                                cb(result);
                            }
                        });
                    }
                    else{
                        cb(result);
                    }
                });
            }
            else{
                cb(result);
            }
        });
    }
}
module.exports = solace;