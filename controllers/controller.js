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

    // initializing variables from the request "req" object
    var user = req.body.username;
    var pass = req.body.password;
    var vpn = req.body.msgVpn;
    var app = req.body.app;
    var desc = req.body.desc;

    // call the soladmin model to configure the message VPN
    soladmin.configureMessageVpn(user, pass, vpn, app, desc, function (result) {
        if (result.body.meta.responseCode === 200) {

            // definiing success json object only after 200 response
            var successObject = {
                data: {
                    "subscriber": app + "_" + desc + "_sub_cu",
                    "subPassword": "sub_password",
                    "publisher": app + "_" + desc + "_pub_cu",
                    "pubPassword": "pub_password"
                }
            }
            // after successful post request render the index page with successObject
            res.render("index", successObject);

            // log the request in the database
            database.insertOne(vpn, app, desc, function (result) {
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
    // call the soladmin model to publish a message
    soladmin.publishMessage()
});

module.exports = router;