// require request and the ORM (object relational mapping)
var request = require("request");
var orm = require("../config/orm.js");

// define soladmin, which contains functions to configure the message router and publish messages
var soladmin = {

    // configure the message router via several POST requests to the SEMP solace API
    configureMessageVpn: function (user, pass, vpn, app, desc, cb) {

        // Request #1: Create the ACL profile for publishing
        orm.createAclProfile(user, pass, vpn, app, desc, "pub", function (result) {

            // If request #1 returns a 200, then...
            if (result.body.meta.responseCode === 200) {

                // Request #2: Create the ACL profile for subscribing
                orm.createAclProfile(user, pass, vpn, app, desc, "sub", function (result) {

                    // If request #2 returns a 200, then...
                    if (result.body.meta.responseCode === 200) {

                        // Request #3: Create the client profile for the publisher
                        orm.createClientUsername(user, pass, vpn, app, desc, "pub", function (result) {

                            // If request #3 returns a 200, then...
                            if (result.body.meta.responseCode === 200) {

                                // Request #4: Create the client profile for the subscriber
                                orm.createClientUsername(user, pass, vpn, app, desc, "sub", function (result) {
                                    // return the result back to the controller either way, as this is the final post request
                                    cb(result);
                                });
                            }
                            else {
                                // If not 200, return the result to the controller
                                cb(result);
                            }
                        });
                    }
                    else {
                        // If not 200, return the result to the controller
                        cb(result);
                    }
                });
            }
            else {
                // If not 200, return the result to the controller
                cb(result);
            }
        });
    },

    // publish a message
    publishMessage: function () {

        // require the Solace Node Module
        var solace = require('solclientjs').debug; // logging supported

        // Initialize factory with the most recent API defaults
        var factoryProps = new solace.SolclientFactoryProperties();
        factoryProps.profile = solace.SolclientFactoryProfiles.version10;
        solace.SolclientFactory.init(factoryProps);

        // enable logging to JavaScript console at WARN level
        // NOTICE: works only with ('solclientjs').debug
        solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);

        // define the publisher, session, and the topic name (taken from form)
        var publisher = {};
        publisher.session = null;
        publisher.topicName = "topic";

        orm.log('\n*** Publisher to topic "' + publisher.topicName + '" is ready to connect ***');

        // main function
        publisher.run = function (argv) {
            publisher.connect(argv);
        };

        // Establishes connection to Solace message router
        publisher.connect = function (argv) {
            if (publisher.session !== null) {
                orm.log('Already connected and ready to publish.');
                return;
            }
            // extract params
            if (argv.length < (2 + 3)) { // expecting 3 real arguments
                orm.log('Cannot connect: expecting all arguments' +
                    ' <protocol://host[:port]> <client-username>@<message-vpn> <client-password>.\n' +
                    'Available protocols are ws://, wss://, http://, https://');
                process.exit();
            }
            var hosturl = argv.slice(2)[0];
            orm.log('Connecting to Solace message router using url: ' + hosturl);
            var usernamevpn = argv.slice(3)[0];
            var username = usernamevpn.split('@')[0];
            orm.log('Client username: ' + username);
            var vpn = usernamevpn.split('@')[1];
            orm.log('Solace message router VPN name: ' + vpn);
            var pass = argv.slice(4)[0];
            // create session
            try {
                publisher.session = solace.SolclientFactory.createSession({
                    // solace.SessionProperties
                    url: hosturl,
                    vpnName: vpn,
                    userName: username,
                    password: pass,
                });
            } catch (error) {
                orm.log(error.toString());
            }
            // define session event listeners
            publisher.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
                orm.log('=== Successfully connected and ready to publish messages. ===');
                publisher.publish();
                //publisher.exit();
            });
            publisher.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
                orm.log('Connection failed to the message router: ' + sessionEvent.infoStr +
                    ' - check correct parameter values and connectivity!');
            });
            publisher.session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
                orm.log('Disconnected.');
                if (publisher.session !== null) {
                    publisher.session.dispose();
                    publisher.session = null;
                }
            });
            // connect the session
            try {
                publisher.session.connect();
            } catch (error) {
                orm.log(error.toString());
            }
        };

        // Publishes one message
        publisher.publish = function () {
            if (publisher.session !== null) {
                var messageText = 'Sample Message';
                var message = solace.SolclientFactory.createMessage();
                message.setDestination(solace.SolclientFactory.createTopicDestination(publisher.topicName));
                message.setBinaryAttachment(messageText);
                message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
                orm.log('Publishing message "' + messageText + '" to topic "' + publisher.topicName + '"...');
                try {
                    publisher.session.send(message);
                    orm.log('Message published.');
                } catch (error) {
                    orm.log(error.toString());
                }
            } else {
                orm.log('Cannot publish because not connected to Solace message router.');
            }
        };

        // publisher.exit = function () {
        //     publisher.disconnect();
        //     setTimeout(function () {
        //         process.exit();
        //     }, 1000); // wait for 1 second to finish
        // };

        // Gracefully disconnects from Solace message router
        publisher.disconnect = function () {
            orm.log('Disconnecting from Solace message router...');
            if (publisher.session !== null) {
                try {
                    publisher.session.disconnect();
                } catch (error) {
                    orm.log(error.toString());
                }
            } else {
                orm.log('Not connected to Solace message router.');
            }
        };

        var args = [
            '',
            '',
            'wss://vmr-mrukojm0fl.messaging.solace.cloud:21220',
            'mike_123_sub_cu@msgvpn-8mqb12lrgh',
            'password']

        publisher.run(args);

    }
}
module.exports = soladmin;