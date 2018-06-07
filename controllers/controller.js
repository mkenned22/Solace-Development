var express = require("express");
var solace = require("../models/solace.js")

var router = express.Router();

// GETS
router.get("/", function(req, res){
    res.render("index");
});

// POSTS
router.post("/configure", function(req, res){

    var hbsObject = {
        data:{
            "subscriber":req.body.app+"_"+req.body.desc+"_sub_cu",
            "subPassword":"subscribe",
            "publisher":req.body.app+"_"+req.body.desc+"_pub_cu",
            "pubPassword":"publish"
        } 
    }

    solace.createAclProfile(req.body.username,req.body.password,req.body.msgVpn,req.body.app,req.body.desc,"pub",function(result){
        if(result.body.meta.responseCode === 200){
            solace.createAclProfile(req.body.username,req.body.password,req.body.msgVpn,req.body.app,req.body.desc,"sub",function(result){
                if(result.body.meta.responseCode === 200){
                    solace.createClientUsername(req.body.username,req.body.password,req.body.msgVpn,req.body.app,req.body.desc,"pub",function(result){
                        if(result.body.meta.responseCode === 200){
                            solace.createClientUsername(req.body.username,req.body.password,req.body.msgVpn,req.body.app,req.body.desc,"sub",function(result){
                                if(result.body.meta.responseCode === 200){
                                    res.render("success",hbsObject);
                                }
                                else{
                                    res.render("failure");
                                }
                            });
                        }
                        else{
                            res.render("failure");
                        }
                    });
                }
                else{
                    res.render("failure");
                }
            });
        }
        else{
            res.render("failure");
        }
    });

});

module.exports = router;