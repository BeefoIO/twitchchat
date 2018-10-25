var tmi = require('./tmi.js/index');
var channelJoinMessages = ['#BoostFuze'];
var channelSubMessages = ['#BoostFuze', '#syrinxx1337', '#bibaboy'];
var saidHelloTo = [];
var express = require('express');
var app = express();
app.use(express.static('public'));
var port = 6077;
var shutdownToken = makeId();

// every channel to lowercase
channelJoinMessages.forEach(channel => {
    channelJoinMessages.push(channel.toLocaleLowerCase());
});
channelSubMessages.forEach(channel => {
    channelSubMessages.push(channel.toLocaleLowerCase());
})

awaitLoginToken().then(function (token, username){
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
            username: username, //Your twitch Username e.g. JohnDoe
            password: "oauth:" + token //Your twitch OAuth token you can get it here: https://twitchapps.com/tmi/ (e.g. oauth:30randomnumbersorchars12313278)
        },
        channels: ['#syrinxx1337', '#BoostFuze', '#bibaboy']
    };

    var client = new tmi.client(options);

    client.connect().catch(err => {
        console.log(err);
    });

    // Events
    // Chat Event
    client.on("chat", function (channel, userstate, message, self) {
        if (self) return;
        var username = userstate.username;
        
        if(channelJoinMessages.includes(channel) && !saidHelloTo.includes(username) && message.toLowerCase().includes(options.identity.username.toLowerCase())) {
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
                client.say(channel, "syrinxxGift bibaGift syrinxxGift " + username + " to " + recipient + " syrinxxGift bibaGift syrinxxGift "/* your subgift message*/).catch(err => {
                    console.log(err);
                });
            }else{
                console.log('subgift event triggered');
                client.say(channel, " syrinxxGift bibaGift syrinxxGift Danke @" + username +  " syrinxxGift bibaGift syrinxxGift "/* your subgift message*/).catch(err => {
                    console.log(err);
                });
            }
        }
    });

    // Cheer Event
    /*client.on("cheer", function (channel, userstate, message) {
        client.say("#BoostFuze", "");
    });*/
});

// auth stuff
/*var options = {
    options: {
        debug: true
    },
    /*connection: {
        server: 'irc.chat.twitch.tv',
        port: 6667,
        secure: false,
        reconnect: true
    },*//*
    identity: {
        username: "BoostFuze", //Your twitch Username e.g. JohnDoe
        password: "oauth:zz54u7fqai8h63no0hjnjrbrusut2s" //Your twitch OAuth token you can get it here: https://twitchapps.com/tmi/ (e.g. oauth:30randomnumbersorchars12313278)
    },
    channels: ['#syrinxx1337', '#BoostFuze', '#bibaboy']
};

var client = new tmi.client(options);

// Connect the client to the server..
client.connect().catch(err => {
    console.log(err);
});*/

// Functions
// Function awaitLoginToken
function awaitLoginToken(username, password) {
    return new Promise(function(resolve, reject) {
        console.log('Login here: http://localhost:' + port + '/auth.html');
        var server = app.listen(port, function () {
            console.log('WebServer started for auth');
        });
        app.post('/callback/twitch/:token', function(req, res){
            server.close();
            res.send('Authorized');
            resolve(req.params.token, req.param.username);
        });
    });
}

// Function makeId
function makeId(length = 16, chars = "abcdefghijklmnopqrstuvwxyz0123456789") {
    var text = "";

    for (var i = 0; i < length; i++)
        text += chars.charAt(Math.floor(Math.random() * chars.length));

    return text;
}

// Events
// Chat Event
/*client.on("chat", function (channel, userstate, message, self) {
    if (self) return;
    var username = userstate.username;
    
    if(channelJoinMessages.includes(channel) && !saidHelloTo.includes(username) && message.toLowerCase().includes(options.identity.username.toLowerCase())) {
        console.log(saidHelloTo);
        client.say(channel, "syrinxxHi " + username + " syrinxxBlau"/* your hello message*//*).catch(err => {
            console.log(err);
        });
        saidHelloTo.push(username);
    }
});

// Resub Event
client.on("resub", function (channel, username, months, message, userstate, methods) {
    if(channelSubMessages.includes(channel) && username.toLowerCase() !== options.identity.username.toLowerCase()){
        console.log('resub event triggered');
        client.say(channel, "syrinxxSub bibaSub syrinxxSub " + username + " x" + months + "  syrinxxSub bibaSub syrinxxSub "/* your resub message*//*).catch(err => {
            console.log(err);
        });
    }
});

// Sub Event
client.on("subscription", function (channel, username, method, message, userstate) {
    if(channelSubMessages.includes(channel) && username.toLowerCase() !== options.identity.username.toLowerCase()){
        console.log('sub event triggered');
        client.say(channel, "syrinxxSub bibaSub syrinxxSub " + username + " syrinxxSub bibaSub syrinxxSub "/* your sub message*//*).catch(err => {
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
            client.say(channel, "syrinxxGift bibaGift syrinxxGift " + username + " to " + recipient.username + " syrinxxGift bibaGift syrinxxGift "/* your subgift message*//*).catch(err => {
                console.log(err);
            });
        }else{
            console.log('subgift event triggered');
            client.say(channel, " syrinxxGift bibaGift syrinxxGift Danke @" + username +  " syrinxxGift bibaGift syrinxxGift "/* your subgift message*//*).catch(err => {
                console.log(err);
            });
        }
    }
});*/

// Cheer Event
/*client.on("cheer", function (channel, userstate, message) {
    client.say("#BoostFuze", "");
});*/