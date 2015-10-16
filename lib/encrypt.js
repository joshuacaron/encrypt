var crypto = require('./crypto-functions.js')
var keys = require('./keys.js')
var Polynomial = require('./polynomial.js')

function encrypt(numKeys, numDecryptKeys, message) {
  return new Promise(function(resolve, reject) {
    keys.generateKeys(numKeys, numDecryptKeys)
    .then(function(keys) {
      var output = '<h4>Your encrypted message:</h4><p>'
      var encrypted = crypto.encrypt(message, keys.polynomial.coefficients[0].toString())
      output += encrypted + '</p><h4>Your encryption keys:</h4><p>'

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
    var key
    if (xs.length > 1) {
      key = Polynomial.interpolate(xs,ys).toString()
    } else {
      // Can't interpolate a constant so take constant directly
      key = ys[0].toString()
    }

    var output = '<h4>Your Original Message:</h4><p>'
    output += crypto.decrypt(message,key) + '</p>'
    resolve(output)
  })
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
}
