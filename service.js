var tmi = require('tmi.js');
var channelJoinMessages = ['#Nordie', '#BoostFuze'];
var channelSubMessages = ['#Shlorox', '#Nordie', '#syrinxx1337', '#Tinkerleo', '#JadiTV', '#BoostFuze'];

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
        username: "BoostFuze",
        password: "oauth:zaw46x9rsm3hqmtrw12210x9nq0oo2"
    },
    channels: [/*'#Trilluxe', '#Shlorox', '#JadiTV',*/ '#syrinxx1337', /*'#Tinkerleo',*/ '#Nordie', '#BoostFuze']
};

var client = new tmi.client(options);

// Connect the client to the server..
client.connect().catch(err => {
    console.log(err);
});

// Events
// Join Event
/*client.on("join", async function (channel, username, self) {
    if(channelJoinMessages.includes(channel) && !self){
        console.log('join event triggered');
        await sleep(5000);
        client.say(channel, "syrinxxHi " + username + " syrinxxBlau").catch(err => {
            console.log(err);
        });
    }
});*/

// Resub Event
client.on("resub", function (channel, username, months, message, userstate, methods) {
    if(channelSubMessages.includes(channel) && username.toLowerCase() !== options.identity.username.toLowerCase()){
        console.log('resub event triggered');
        client.say(channel, "syrinxxSub bibaSub syrinxxSub " + username + " x" + months + "  syrinxxSub bibaSub syrinxxSub ").catch(err => {
            console.log(err);
        });
    }
});

// Sub Event
client.on("subscription", function (channel, username, method, message, userstate) {
    if(channelSubMessages.includes(channel) && username.toLowerCase() !== options.identity.username.toLowerCase()){
        console.log('sub event triggered');
        client.say(channel, "syrinxxSub bibaSub syrinxxSub " + username + " syrinxxSub bibaSub syrinxxSub ").catch(err => {
            console.log(err);
        });
    }
});

// Cheer Event
/*client.on("cheer", function (channel, userstate, message) {
    client.say("#BoostFuze", "");
});*/