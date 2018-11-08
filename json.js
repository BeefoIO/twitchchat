var fs = require('fs');

var settings = fs.readFileSync('./settings.json', 'utf8');
console.log(settings);
var settingsContent = JSON.parse(settings);

console.log(settingsContent);