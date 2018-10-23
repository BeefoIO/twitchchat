var tmi = require('tmi.js');
var channelSubMessages = ['#BoostFuze'];

// Functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// auth stuff
var options = {
    options: {
        debug: true
    },
    /*connection: {
        server: 'irc.chat.twitch.tv',
        port: 6667,
        secure: false,
        reconnect: true
    },*/
    identity: {
        username: "", //Your twitch Username e.g. JohnDoe
        password: "" //Your twitch OAuth token you can get it here: https://twitchapps.com/tmi/ (e.g. oauth:30randomnumbersorchars12313278)
    },
    channels: ['#syrinxx1337', '#BoostFuze']
};

var client = new tmi.client(options);

// Connect the client to the server..
client.connect().catch(err => {
    console.log(err);
});

// Events
// Resub Event
client.on("resub", function (channel, username, months, message, userstate, methods) {
    if(channelSubMessages.includes(channel) && username.toLowerCase() !== options.identity.username.toLowerCase()){
        console.log('resub event triggered');
        client.say(channel, "syrinxxSub bibaSub syrinxxSub " + username + " x" + months + "  syrinxxSub bibaSub syrinxxSub "/* your resub message*/).catch(err => {
            console.log(err);
        });
    }
});

// Sub Event
client.on("subscription", function (channel, username, method, message, userstate) {
    if(channelSubMessages.includes(channel) && username.toLowerCase() !== options.identity.username.toLowerCase()){
        console.log('sub event triggered');
        client.say(channel, "syrinxxSub bibaSub syrinxxSub " + username + " syrinxxSub bibaSub syrinxxSub "/* your sub message*/).catch(err => {
            console.log(err);
        });
    }
});

// Cheer Event
/*client.on("cheer", function (channel, userstate, message) {
    client.say("#BoostFuze", "");
});*/