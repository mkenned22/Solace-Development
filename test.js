var solace = require("solclientjs").debug;

var factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);

// create session
solace.session = solace.SolclientFactory.createSession({
    // solace.SessionProperties
    url:      'ws://mr-91b69336gh.messaging.solace.cloud:20259',
    vpnName:  'msgvpn-91b694xipf',
    userName: 'solace-cloud-client',
    password: 'vu5pv9pi043cs6t9jgjel7amqg',
});

solace.session.on(solace.SessionEventCode.MESSAGE, function (message) {
    solace.log('Received message: "' + message.getBinaryAttachment() + '", details:\n' + message.dump());
    console.log("Received message:" + message.dump());
});

solace.subscribe = function () {
    /*...SNIP...*/
        try {
            solace.session.subscribe(
                solace.SolclientFactory.createTopic("tutorial/topic"),
                true,
                "tutorial/topic",
                10000
            );
        } catch (error) {
            solace.log(error.toString());
        }
    /*...SNIP...*/
}
// define session event listeners
    /*...see section Session Events...*/
// define message event listener
    /*...see section Receiving a message...*/
// connect the session
try {
    solace.session.connect();
    console.log("connected");
} catch (error) {
    solace.log(error.toString());
}