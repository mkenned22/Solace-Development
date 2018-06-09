// controller.js defines all of the routes for the application

// require express, and the two models "soladmin" and "database"
var express = require("express");
var soladmin = require("../models/soladmin.js")
var database = require("../models/database.js")
var orm = require("../config/orm.js");

// define the router
var router = express.Router();

// GET Requests
router.get("/", function (req, res) {
    res.render("index");
});

// POST Requests
// POST for the Configure Section
router.post("/", function (req, res) {

    orm.log("Request to configure message router has been received.")

    // initializing variables from the request "req" object
    var api = req.body.api;
    var vpn = req.body.msgVpn;
    var user = req.body.username;
    var pass = req.body.password;
    var app = req.body.app;

    // call the soladmin model to configure the message VPN
    soladmin.configureMessageVpn(user, pass, vpn, app, api, function (result) {
        if (result.body.meta.responseCode === 200) {

            // definiing success json object only after 200 response
            var successObject = {
                data: {
                    "subscriber": app + "_sub_cu",
                    "subPassword": "sub_password",
                    "publisher": app + "_pub_cu",
                    "pubPassword": "pub_password",
                    "vpn":vpn
                }
            }
            // after successful post request render the index page with successObject
            res.render("index", successObject);
            
            // log the request in the database
            database.insertOne(vpn, app, function (result) {
                orm.log(result)
            });
        }
        else {
            // if receiving any other status code besides 200 return the failure page
            orm.log(result);
            res.render("failure");
        }
    });

});

// POST for the Publish Section 
router.post("/test", function (req, res) {

    // initializing variables from the request "req" object
    var api = req.body.api
    var vpn = req.body.msgVpn;
    var user = req.body.username;
    var pass = req.body.password;
    var topic = req.body.topic;
    var msg = req.body.message;

    // call the soladmin model to publish a message
    soladmin.publishMessage(api,vpn,user,pass,topic,msg,function(result){

    })
});

module.exports = router;