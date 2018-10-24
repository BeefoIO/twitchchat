var tmi = require('./tmi.js/index');
var channelJoinMessages = ['#BoostFuze'];
var channelSubMessages = ['#BoostFuze', '#syrinxx1337', '#bibaboy'];
var saidHelloTo = [];
var port = 6077;

// auth stuff
var options = {
    options: {
        //debug: true
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
    channels: ['#syrinxx1337', '#BoostFuze', '#bibaboy']
};

var client = new tmi.client(options);

// Connect the client to the server..
client.connect().catch(err => {
    console.log(err);
});

// Events
// Chat Event
client.on("chat", function (channel, userstate, message, self) {
    if (self) return;
    var username = userstate.username;
    
    if(channelJoinMessages.includes(channel) && !saidHelloTo.includes(username) && message.toLowerCase().includes(username.toLowerCase())) {
        console.log(saidHelloTo);
        client.say(channel, "syrinxxHi " + username + " syrinxxBlau"/* your hello message*/).catch(err => {
            console.log(err);
        });
        saidHelloTo.push(username);
    }
});

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

// SubGift Event
client.on("subgift", function (channel, username, recipient, method, userstate) {
    if(channelSubMessages.includes(channel)){
        if(username.toLowerCase() !== options.identity.username.toLowerCase()){
            console.log('subgift event triggered');
            console.log(recipient);
            client.say(channel, "syrinxxGift bibaGift syrinxxGift " + username + " to " + recipient.username + " syrinxxGift bibaGift syrinxxGift "/* your subgift message*/).catch(err => {
                console.log(err);
            });
        }else{
            console.log('subgift event triggered');
            client.say(channel, "Danke @" + username + " syrinxxGift bibaGift syrinxxGift syrinxxGift bibaGift syrinxxGift "/* your subgift message*/).catch(err => {
                console.log(err);
            });
        }
    }
});

// Cheer Event
/*client.on("cheer", function (channel, userstate, message) {
    client.say("#BoostFuze", "");
});*/