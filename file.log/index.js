var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);

var formatTime = (date) => {
    var hours = date.getHours();
    var mins  = date.getMinutes();
    var secs = date.getSeconds();

    hours = (hours < 10 ? "0" : "") + hours;
    mins = (mins < 10 ? "0" : "") + mins;
    secs = (secs < 10 ? "0" : "") + secs;

    return `${hours}:${mins}:${secs}`;
};

var formatDateTime = (date) => {
    var year = date.getFullYear();
    var month  = date.getMonth();
    var day = date.getDate();
    var hours = date.getHours();
    var mins  = date.getMin+utes();
    var secs = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hours = (hours < 10 ? "0" : "") + hours;
    mins = (mins < 10 ? "0" : "") + mins;
    secs = (secs < 10 ? "0" : "") + secs;

    return `${day}.${month}.${year} ${hours}:${mins}:${secs}`;
};

var date = new Date();
var hours = date.getHours();
var mins  = date.getMinutes();
var secs  = date.getSeconds();

hours = (hours < 10 ? "0" : "") + hours;
mins = (mins < 10 ? "0" : "") + mins;
secs = (secs < 10 ? "0" : "") + secs;

logPath = appDir + '/log/debug.log';

if (!fs.existsSync(logPath)) {
    fs.writeFile(logPath, '', (err) => {
        if (err) throw err;
    });
}

log_file = fs.createWriteStream(appDir + '/log/' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '_' + hours + '-' + mins + '-' + secs + '_logger.log', {flags : 'w'});

var currentLevel = "info";
var levels = { "trace": 0, "debug": 1, "info": 2, "warn": 3, "error": 4, "fatal": 5 }

// Logger implementation..
function log(level) {
    // Return a console message depending on the logging level..
    return function (message) {
        if (levels[level] >= levels[currentLevel]) {
            log_file.write(`[${formatTime(new Date())}] ${level}: ${message}\n`);
            fs.appendFile(logPath, `[${formatDateTime(new Date())}] ${level}: ${message}\n`)
        }
    }
}

module.exports = {
    // Change the current logging level..
    /*createFile: function(appHome) {
        date = new Date();
        var hours = date.getHours();
        var mins  = date.getMinutes();

        hours = (hours < 10 ? "0" : "") + hours;
        mins = (mins < 10 ? "0" : "") + mins;

        log_file = fs.createWriteStream(appDir + '/log/' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '_' + hours + '-' + mins + '_logger.log', {flags : 'w'});
    },*/
    setLevel: function(level) {
        currentLevel = level;
    },
    trace: log("trace"),
    debug: log("debug"),
    info: log("info"),
    warn: log("warn"),
    error: log("error"),
    fatal: log("fatal")
};
