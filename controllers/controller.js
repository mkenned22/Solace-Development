var express = require("express");
var request = require("request");
var solace = require("../models/solace.js")

var router = express.Router();

// GETS
router.get("/", function(req, res){
    res.render("index");
});

// POSTS
router.post("/configure", function(req, res){
    var msgVpn = req.body.msgVpn;
    var username = req.body.username;
    var password = req.body.password;
    var app = req.body.app;
    var desc = req.body.desc;
    var api = "mr-91b69336gh.messaging.solace.cloud:20270/SEMP/v2/config";
    var pubacl = app+"_"+desc+"_pub_acl";
    var subacl = app+"_"+desc+"_sub_acl";
    var pubcu = app+"_"+desc+"_pub_cu";
    var subcu = app+"_"+desc+"_sub_cu";

    //for cloud, message VPN is already cready
    // only need to create acl, cp, and cu
    var pub_acl_params = {
        uri: "https://"+username+":"+password+"@"+api+"/msgVpns/"+msgVpn+"/aclProfiles",
        method: 'POST',
        json: {
            "aclProfileName":pubacl,
            "clientConnectDefaultAction":"allow",
            "publishTopicDefaultAction":"allow",
        }
    };
    var pub_cu_params = {
        uri: "https://"+username+":"+password+"@"+api+"/msgVpns/"+msgVpn+"/clientUsernames",
        method: 'POST',
        json: {
            "clientUsername":pubcu,
            "aclProfileName":pubacl,
            "clientProfileName":"default",
            "enabled":true,
            "password":"publish"

        }
    };

    var sub_acl_params = {
        uri: "https://"+username+":"+password+"@"+api+"/msgVpns/"+msgVpn+"/aclProfiles",
        method: 'POST',
        json: {
            "aclProfileName":subacl,
            "clientConnectDefaultAction":"allow",
            "subscribeTopicDefaultAction":"allow"
        }
    };
    var sub_cu_params = {
        uri: "https://"+username+":"+password+"@"+api+"/msgVpns/"+msgVpn+"/clientUsernames",
        method: 'POST',
        json: {
            "clientUsername":subcu,
            "aclProfileName":subacl,
            "clientProfileName":"default",
            "enabled":true,
            "password":"subscribe"
        }
    };
    // request(pub_acl_params,function(error,res,body){
    //   console.log(body); 
    //   request(pub_cu_params,function(error,res,body){
    //     console.log(body); 
    //  });
    // });
    
    // request(sub_acl_params,function(error,res,body){
    //     console.log(body); 
    //     request(sub_cu_params,function(error,res,body){
    //         console.log(body); 
    //     });
    // });

    solace.createAclProfile(req.body.username,req.body.password,req.body.msgVpn,req.body.app,req.body.desc,"pub",function(result){
        res.render("success",hbsObject);
    })

    var hbsObject = {
        data:{
            "subscriber":sub_cu_params.json.clientUsername,
            "subPassword":sub_cu_params.json.password,
            "publisher":pub_cu_params.json.clientUsername,
            "pubPassword":pub_cu_params.json.password
        } 
    }
    console.log(hbsObject);

    //res.render("success",hbsObject);
});

module.exports = router;