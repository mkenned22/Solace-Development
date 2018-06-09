// Require express, body-parser and express-handlebars
var express = require("express");
var bodyParser = require("body-parser");
var handlebars = require("express-handlebars");

// Define PORT to either refer to what is defined within the environment variable 
// (which gets dynamically defined for PAAS services like Heroku) or use port 8000 if no port is defined
var PORT = process.env.PORT || 8000;

// Define app
var app = express();

// Configure Express app to refer to the "public" folder for static content
app.use(express.static("public"));

// Configure Express app to use Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Express app to use the Express Handlebars templating engine
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Define the application context routes and configure the app to use these routes
var routes = require("./controllers/controller.js")
app.use(routes);

// Call the "listen" method so that the application starts accepting requests
app.listen(PORT, function(){
    console.log("Server is listening on http://localhost:" + PORT);
});