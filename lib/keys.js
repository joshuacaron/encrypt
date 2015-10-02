var Polynomial = require('./polynomial.js')
var crypto = require('./crypto-functions.js')

/**
 * Generates a polynomial with cryptographically secure random coefficients.
 * @param  {number} order The order of the polynomial.
 * @return {Promise}       A promise with one parameter returning the polynomial.
 */
function generatePolynomial(order) {
  return new Promise(function(resolve, reject) {
    var coefficients = []

    function addCoefficient(num) {
      coefficients.push(num)
      if (coefficients.length === order + 1) {
        var output = new Polynomial(coefficients)
        resolve(output)
      }
    }

    for (var i = 0; i < order + 1; ++i) {
      crypto.generateSecureRandom(100000000, 999999999)
      .then(function(randomNum) {
        addCoefficient(randomNum)
      })
    }
  })
}

/**
 * Inputs numKeys points into the polynomial and returns the values to create keys.
 * @param  {number} numKeys    The number of keys that should be generated.
 * @param  {number} numToDecrypt The number of keys required to decrypt the text.
 * @return {Promise}            An array of keys to be given to the user.
 */
function generateKeys(numKeys, numToDecrypt) {
  return new Promise(function(resolve, reject) {
    generatePolynomial(numToDecrypt - 1)
    .then(function(p) {
      var keys = []

      for (var i = 2; i < numKeys + 2; ++i) {
        var key = numToDecrypt + '.' + i + '.' + p.evaluate(i).toString(16)
        keys.push(key)
      }

      keys['polynomial'] = p

      resolve(keys)
    })
  })
}

module.exports = {
  generateKeys: generateKeys,
  generatePolynomial: generatePolynomial
}
