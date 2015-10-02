var crypto = require('./lib/crypto-functions.js')
var keys = require('./lib/keys.js')
var Polynomial = require('./lib/polynomial.js')

function encrypt(numKeys, numDecryptKeys, message) {
  return new Promise(function(resolve, reject) {
    keys.generateKeys(numKeys, numDecryptKeys)
    .then(function(keys) {
      var output = '<p>Your encrypted message:</p><p>'
      var encrypted = crypto.encrypt(message, keys.polynomial.coefficients[0].toString())
      output += encrypted + '</p><p>Your encryption keys:</p><p>'

      for (var i = 0; i < keys.length; ++i) {
        output += keys[i] + '<br>'
      }

      output += '</p>'

      resolve(output)
    })
  })
}

function decrypt(keys, message) {
  return new Promise(function(resolve, reject) {
    keys = keys.split('\r\n')

    var xs = []
    var ys = []
    var split = []
    for (var i = 0; i < keys.length; ++i) {
      split.push(keys[i].split('.'))
    }
    var numKeys = parseInt(split[0][0])

    for (var j = 0; j < numKeys; ++j) {
      xs.push(parseInt(split[j][1]))
      ys.push(parseInt(split[j][2], 16))
    }
    var key = Polynomial.interpolate(xs,ys).toString()

    var output = '<p>Your original message:</p><p>'
    output += crypto.decrypt(message,key) + '</p>'
    resolve(output)
  })
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
}
