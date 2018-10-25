var tmi = require('./tmi.js/index');
var channelJoinMessages = ['#BoostFuze'];
var channelSubMessages = ['#BoostFuze', '#syrinxx1337', '#bibaboy'];
var saidHelloTo = [];
var express = require('express');
var app = express();
app.use(express.static('public'));
var port = 6077;

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
        connection: {
            server: 'irc-ws.chat.twitch.tv',
            port: 443,
            secure: true,
            reconnect: true
        },
        identity: {
            username: username, 
            password: "oauth:" + token //Your twitch OAuth token you can get it here: https://twitchapps.com/tmi/ (e.g. oauth:30randomnumbersorchars12313278)
        },
        channels: ['#syrinxx1337', '#BoostFuze', '#bibaboy']
    };

    var client = new tmi.client(options);

    client.connect().then(idk => {
        console.log('Authenticated successfully');
    }).catch(err => {
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
            console.log('subgift event triggered');
            if(username.toLowerCase() !== options.identity.username.toLowerCase()){
                client.say(channel, "syrinxxGift bibaGift syrinxxGift " + username + " to " + recipient + " syrinxxGift bibaGift syrinxxGift "/* your subgift message*/).catch(err => {
                    console.log(err);
                });
            }else{
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

// Functions
// Function awaitLoginToken
function awaitLoginToken(username, password) {
    return new Promise(function(resolve, reject) {
        var server = app.listen(port, function () {
            console.log('WebServer started for auth');
            console.log('Login here: http://localhost:' + port + '/auth.html');
        });
        app.post('/callback/twitch/:token', function(req, res){
            res.send('Authorized');
            server.close();
            resolve(req.params.token, req.param.username);
        });
    });
}