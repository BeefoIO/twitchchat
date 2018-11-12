var tmi = require('./tmi.js/index')
//var logger = require('@beefoio/file.log')
var logger = {
  trace: function(message) {},
  debug: function(message) {},
  info: function(message) {},
  warn: function(message) {},
  error: function(message) {},
  fatal: function(message) {},
  enableConsoleOutput: function() {},
  setLevel: function(level) {}
}
logger.enableConsoleOutput()
logger.setLevel('info')
// var channelSubMessages = ['#BoostFuze', '#syrinxx1337', '#paaaaaaaaaaddy'];
var saidHelloTo = []
var express = require('express')
var cors = require('cors')
var app = express()
var assets = express()
var fs = require('fs')
if (!fs.existsSync('./settings.json')) {
  if (!fs.existsSync('./settings_example.json')) {
    logger.fatal('You need to create a settings.json.')
    logger.fatal('There is an example at: settings_example.json')
    process.exit(0)
  }
  var settings_example = fs.readFileSync('./settings_example.json', 'utf8')
  fs.writeFileSync('./settings.json', settings_example)
  logger.fatal('We have copied the content of settings_example.json to settings.json')
  logger.fatal('It will now stop and you can edit the settings.json to your preferences')
  logger.fatal('Read the _comments section of the settings.json for further informations to the structure')
  process.exit(0)
}
var settings = fs.readFileSync('./settings.json', 'utf8')
var settings = JSON.parse(settings)

var channelSubMessages = settings.channelSubMessages

app.use(express.static('public'))
assets.use(express.static('assets'))
app.set('view engine', 'ejs')
app.set('views', './views')
assets.set('view engine', 'ejs')
assets.set('views', './views')
var port = 6077
var portAssets = 6078

var assetsServer = assets.listen(portAssets, function () {
  logger.info('WebServer started for assets')
  logger.info('Assets are served here: http://localhost:' + portAssets + '/')
});

assets.get('/appPath/:appPath', function(req, res) {
  res.render('appPath', {appPath: Buffer.from(req.params.appPath, 'base64').toString('ascii')})
});

// every channel to lowercase
channelSubMessages.forEach(channel => {
  channelSubMessages.push(channel.toLocaleLowerCase())
})

awaitLoginToken().then(function (loginData) {
  // auth stuff
  var options = {
    options: {
      // debug: true
    },
    connection: {
      server: 'irc-ws.chat.twitch.tv',
      port: 443,
      secure: true,
      reconnect: true
    },
    identity: {
      username: loginData.username,
      password: 'oauth:' + loginData.token
    },
    channels: settings.channels
  }

  var client = new tmi.client(options)

  client.connect().then(idk => {
    logger.info('Authenticated successfully')
  }).catch(err => {
    logger.error(err)
  })

  // Events
  // Resub Event
  client.on('resub', function (channel, username, months, message, userstate, methods) {
    if (channelSubMessages.includes(channel) && username.toLowerCase() !== options.identity.username.toLowerCase()) {
      if (typeof (settings.resubmessage[channel.substring(1)]) !== 'undefined') {
        var string = settings.resubmessage[channel.substring(1)].replace(/%username%/g, username).replace(/%months%/g, months)
      } else if (typeof (settings.resubmessage.default) !== 'undefined') {
        var string = settings.resubmessage.default.replace(/%username%/g, username).replace(/%months%/g, months)
      } else {
        return
      }
      logger.info('resub event triggered')
      client.say(channel, string).catch(err => {
        logger.error(err)
      })
    }
  })

  // Sub Event
  client.on('subscription', function (channel, username, method, message, userstate) {
    if (channelSubMessages.includes(channel) && username.toLowerCase() !== options.identity.username.toLowerCase()) {
      if (typeof (settings.submessage[channel.substring(1)]) !== 'undefined') {
        var string = settings.submessage[channel.substring(1)].replace(/%username%/g, username)
      } else if (typeof (settings.submessage.default) !== 'undefined') {
        var string = settings.submessage.default.replace(/%username%/g, username)
      } else {
        return
      }
      logger.info('sub event triggered')
      client.say(channel, string).catch(err => {
        logger.error(err)
      })
    }
  })

  // SubGift Event
  client.on('subgift', function (channel, username, recipient, method, subMysteryGiftBool, userstate, message) {
    logger.debug(JSON.stringify(message))
    if (subMysteryGiftBool) {
      counter = recipient + 1
      counterRun = 0
      logger.info('submysterygift event triggered')
      if (username.toLowerCase() !== options.identity.username.toLowerCase() && channelSubMessages.includes(channel)) {
        if (recipient !== true) {
          if (typeof (settings.submysterygiftmessage[channel.substring(1)]) !== 'undefined') {
            var string = settings.submysterygiftmessage[channel.substring(1)].replace(/%username%/g, username).replace(/%subs%/g, recipient)
          } else if (typeof (settings.submysterygiftmessage.default) !== 'undefined') {
            var string = settings.submysterygiftmessage.default.replace(/%username%/g, username).replace(/%subs%/g, recipient)
          } else {
            return
          }
          client.say(channel, string).catch(err => {
            logger.error(err)
          })
        } else {
          if (typeof (settings.submysterygiftmessage[channel.substring(1)]) !== 'undefined') {
            var string = settings.submysterygiftmessage[channel.substring(1)].replace(/%username%/g, username).replace(/%subs%/g, '1')
          } else if (typeof (settings.submysterygiftmessage.default) !== 'undefined') {
            var string = settings.submysterygiftmessage.default.replace(/%username%/g, username).replace(/%subs%/g, '1')
          } else {
            return
          }
          client.say(channel, string).catch(err => {
            logger.error(err)
          })
        }
      }
      return
    } else if (!subMysteryGiftBool && typeof (counterRun) !== 'undefined') {
      counter = 0
      counterRun = 0
    }
    if (counterRun <= counter) {
      counterRun++
      return
    }
    /* logger.info('');
        logger.info('');
        logger.info(message);
        logger.info('');
        logger.info(''); */

    logger.info('subgift event triggered')

    if (channelSubMessages.includes(channel)) {
      if (username.toLowerCase() !== options.identity.username.toLowerCase()) {
        if (typeof (settings.subgiftmessage[channel.substring(1)]) !== 'undefined') {
          var string = settings.subgiftmessage[channel.substring(1)].replace(/%username%/g, username).replace(/%recipient%/g, recipient)
        } else if (typeof (settings.subgiftmessage.default) !== 'undefined') {
          var string = settings.subgiftmessage.default.replace(/%username%/g, username).replace(/%recipient%/g, recipient)
        } else {
          return
        }
        client.say(channel, string).catch(err => {
          logger.error(err)
        })
      }
    }
  })

  /* client.on("submysterygift", function(channel, username, method, userstate, message) {
        logger.info("");
        logger.info("");
        logger.info(message);
        logger.info("");
        logger.info("");
    }); */

  client.on('otherthings', function (things, msgid) {
    logger.info('')
    logger.info('')
    logger.info('MSGID: ' + msgid)
    logger.info('')
    logger.info(things)
    logger.info('')
    logger.info('')
  })

  // Cheer Event
  /* client.on("cheer", function (channel, userstate, message) {
        client.say("#BoostFuze", "");
    }); */
})

// Functions
/*
 * Function awaitLoginToken
 * @return object
 */
function awaitLoginToken (username, password) {
  return new Promise(function (resolve, reject) {
    var server = app.listen(port, function () {
      logger.info('WebServer started for auth')
      logger.info('Login here: http://localhost:' + port + '/auth.html')
    })
    app.get('/callback/twitch/:token/:username', function (req, res) {
      if (req.params.username && req.params.token) {
        res.render('authorized')
        server.close()
        resolve({
          username: req.params.username,
          token: req.params.token
        })
      } else {
        res.render('no_user');
      }
    })
  })
}
