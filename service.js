var tmi = require('./tmi.js/index');
var channelJoinMessages = ['#BoostFuze'];
var channelSubMessages = ['#BoostFuze', '#syrinxx1337'];
var saidHelloTo = [];
var express = require('express');
var cors = require('cors');
var app = express();
var assets = express();

app.use(express.static('public'));
assets.use(express.static('assets'));
app.set('view engine', 'ejs')
app.set('views', './views');
var port = 6077;
var portAssets = 6078;

var assetsServer = assets.listen(portAssets, function () {
    console.log('WebServer started for assets');
    console.log('Assets are served here: http://localhost:' + portAssets + '/');
});



// every channel to lowercase
channelJoinMessages.forEach(channel => {
    channelJoinMessages.push(channel.toLocaleLowerCase());
});
channelSubMessages.forEach(channel => {
    channelSubMessages.push(channel.toLocaleLowerCase());
})

awaitLoginToken().then(function (loginData){
    // auth stuff
    var options = {
        options: {
            //debug: true
        },
        connection: {
            server: 'irc-ws.chat.twitch.tv',
            port: 443,
            secure: true,
            reconnect: true
        },
        identity: {
            username: loginData.username, 
            password: "oauth:" + loginData.token //Your twitch OAuth token you can get it here: https://twitchapps.com/tmi/ (e.g. oauth:30randomnumbersorchars12313278)
        },
        channels: ['#syrinxx1337', '#BoostFuze', '#shlorox']
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
    client.on("subgift", function (channel, username, recipient, method, subMysteryGiftBool, userstate, message) {
        if(subMysteryGiftBool){
            counter = recipient;
            counterRun = 0;
            console.log('submysterygift event triggered');
            if(username.toLowerCase() !== options.identity.username.toLowerCase() && channelSubMessages.includes(channel)){
                client.say(channel, "syrinxxGift bibaGift syrinxxGift " + username + " gifted " + recipient + " to the Community syrinxxGift bibaGift syrinxxGift "/* your subgift message*/).catch(err => {
                    console.log(err);
                });
            }
        }else {
            counter = 0;
        }
        if(counter != counterRun){
            return;
        }
        console.log('');
        console.log('');
        console.log(message);
        console.log('');
        console.log('');

        console.log('subgift event triggered');

        if(channelSubMessages.includes(channel)){
            if(username.toLowerCase() !== options.identity.username.toLowerCase()){
                client.say(channel, "syrinxxGift bibaGift syrinxxGift " + username + " to " + recipient + " syrinxxGift bibaGift syrinxxGift "/* your subgift message*/).catch(err => {
                    console.log(err);
                });
            }
        }
    });

    /*client.on("submysterygift", function(channel, username, method, userstate, message) {
        console.log("");
        console.log("");
        console.log(message);
        console.log("");
        console.log("");
    });*/

    client.on("otherthings", function(things, msgid) {
        console.log("");
        console.log("");
        console.log("MSGID: " + msgid);
        console.log("");
        console.log(things);
        console.log("");
        console.log("");
    });

    // Cheer Event
    /*client.on("cheer", function (channel, userstate, message) {
        client.say("#BoostFuze", "");
    });*/
});

// Functions
/*
 * Function awaitLoginToken
 * @return object
 */
function awaitLoginToken(username, password) {
    return new Promise(function(resolve, reject) {
        var server = app.listen(port, function () {
            console.log('WebServer started for auth');
            console.log('Login here: http://localhost:' + port + '/auth.html');
        });
        app.get('/callback/twitch/:token/:username', function(req, res){
            if(req.params.username && req.params.token){
                res.render('authorized');
                server.close();
                resolve({
                    username: req.params.username,
                    token: req.params.token
                });
            }else{
                res.render('no_user');
            }
        });
    });
}