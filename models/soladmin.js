var request = require("request");
var orm = require("../config/orm.js");

var soladmin = {
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
    },
    publishMessage: function(){

        var solace = require('solclientjs').debug; // logging supported

        // Initialize factory with the most recent API defaults
        var factoryProps = new solace.SolclientFactoryProperties();
        factoryProps.profile = solace.SolclientFactoryProfiles.version10;
        solace.SolclientFactory.init(factoryProps);

        // enable logging to JavaScript console at WARN level
        // NOTICE: works only with ('solclientjs').debug
        solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);
        
        var publisher = {};
        publisher.session = null;
        publisher.topicName = "tutorial/topic";
        
        // Logger
        publisher.log = function (line) {
            var now = new Date();
            var time = [('0' + now.getHours()).slice(-2), ('0' + now.getMinutes()).slice(-2),
                ('0' + now.getSeconds()).slice(-2)];
            var timestamp = '[' + time.join(':') + '] ';
            console.log(timestamp + line);
        };
        
        publisher.log('\n*** Publisher to topic "' + publisher.topicName + '" is ready to connect ***');
        
        // main function
        publisher.run = function (argv) {
            publisher.connect(argv);
        };
        
            // Establishes connection to Solace message router
            publisher.connect = function (argv) {
                if (publisher.session !== null) {
                    publisher.log('Already connected and ready to publish.');
                    return;
                }
                // extract params
                if (argv.length < (2 + 3)) { // expecting 3 real arguments
                    publisher.log('Cannot connect: expecting all arguments' +
                        ' <protocol://host[:port]> <client-username>@<message-vpn> <client-password>.\n' +
                        'Available protocols are ws://, wss://, http://, https://');
                    process.exit();
                }
                var hosturl = argv.slice(2)[0];
                publisher.log('Connecting to Solace message router using url: ' + hosturl);
                var usernamevpn = argv.slice(3)[0];
                var username = usernamevpn.split('@')[0];
                publisher.log('Client username: ' + username);
                var vpn = usernamevpn.split('@')[1];
                publisher.log('Solace message router VPN name: ' + vpn);
                var pass = argv.slice(4)[0];
                // create session
                try {
                    publisher.session = solace.SolclientFactory.createSession({
                        // solace.SessionProperties
                        url:      hosturl,
                        vpnName:  vpn,
                        userName: username,
                        password: pass,
                    });
                } catch (error) {
                    publisher.log(error.toString());
                }
                // define session event listeners
                publisher.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
                    publisher.log('=== Successfully connected and ready to publish messages. ===');
                    publisher.publish();
                    //publisher.exit();
                });
                publisher.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
                    publisher.log('Connection failed to the message router: ' + sessionEvent.infoStr +
                        ' - check correct parameter values and connectivity!');
                });
                publisher.session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
                    publisher.log('Disconnected.');
                    if (publisher.session !== null) {
                        publisher.session.dispose();
                        publisher.session = null;
                    }
                });
                // connect the session
                try {
                    publisher.session.connect();
                } catch (error) {
                    publisher.log(error.toString());
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
                    publisher.log('Publishing message "' + messageText + '" to topic "' + publisher.topicName + '"...');
                    try {
                        publisher.session.send(message);
                        publisher.log('Message published.');
                    } catch (error) {
                        publisher.log(error.toString());
                    }
                } else {
                    publisher.log('Cannot publish because not connected to Solace message router.');
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
                publisher.log('Disconnecting from Solace message router...');
                if (publisher.session !== null) {
                    try {
                        publisher.session.disconnect();
                    } catch (error) {
                        publisher.log(error.toString());
                    }
                } else {
                    publisher.log('Not connected to Solace message router.');
                }
            };

            var args = [ 
            '',
            '',
            'wss://vmr-mrukojm0fl.messaging.solace.cloud:21220',
            'mike_123_sub_cu@msgvpn-8mqb12lrgh',
            'password' ]
          
            publisher.run(args);
        
    }
}
module.exports = soladmin;