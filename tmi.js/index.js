// Provide support for < Chrome 41 mainly due to CLR Browser..
String.prototype.includes || (String.prototype.includes = function () {
  return String.prototype.indexOf.apply(this, arguments) !== -1
}), String.prototype.startsWith || (String.prototype.startsWith = function (a, b) {
  return b = b || 0, this.indexOf(a, b) === b
}), Object.setPrototypeOf || (Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto
  return obj
})

module.exports = {
  client: require('./lib/client'),
  Client: require('./lib/client')
}
