var express = require("express");
var solace = require("../models/solace.js")
var database = require("../models/database.js")

var router = express.Router();

// GETS
router.get("/", function(req, res){
    res.render("index");
});

// POSTS
router.post("/", function(req, res){

    var user = req.body.username;
    var pass = req.body.password;
    var vpn = req.body.msgVpn;
    var app = req.body.app;
    var desc = req.body.desc;

    var successObject = {
        data:{

            "subscriber":app+"_"+desc+"_sub_cu",
            "subPassword":"subscribe",
            "publisher":app+"_"+desc+"_pub_cu",
            "pubPassword":"publish"
        } 
    }

    var hbsObject = {
        data:{
            "subscriber":app+"_"+desc+"_sub_cu",
            "subPassword":"subscribe",
            "publisher":app+"_"+desc+"_pub_cu",
            "pubPassword":"publish"
        } 
    }

    solace.configureMessageVpn(user,pass,vpn,app,desc,function(result){
        if(result.body.meta.responseCode === 200){
            res.render("index",hbsObject);
            database.insertOne(vpn,app,desc,function(result){
                console.log(result)
            });
        }
        else{
            res.render("failure");
        }     
    });

});

module.exports = router;