var crypto = require('crypto')

var message = 'test123'
var password = 'swagyolo'
var algorithm = 'aes-256-cbc'
var numEncryptKeys = 1
var numDecryptKeys = 1

/**
 * Encrypts a string with the globally set algorithm and password.
 * @param  {string} msg The message to be encrypted.
 * @return {string}     The hex value of the encrypted message.
 */
function encrypt(msg) {
  var cipher = crypto.createCipher(algorithm, password)
  cipher.setEncoding('hex')
  cipher.write(msg)
  cipher.end()
  var encryptedMsg = cipher.read()
  return encryptedMsg
}

/**
 * Decrypts a string with the globally set algorithm and password.
 * @param  {string} msg The hex representation of the string to decrypt (having previously encrypted with encrypt function).
 * @return {string}     Returns the utf8 value of the decrypted string.
 */
function decrypt(msg) {
  var decipher = crypto.createDecipher(algorithm, password)
  decipher.setEncoding('utf8')
  decipher.write(msg, 'hex')
  decipher.end()
  var originalMsg = decipher.read()
  return originalMsg
}

/**
 * Asynchronously generates a cryptographically secure random number in the specified range using crypto wrapper for openssl.
 * @param  {int}   min         The minimum value the random number can take.
 * @param  {int}   max         The maximum value the random number can take.
 * @param  {Function} callback A callback with the a single parameter for the randomly generated value.
 */
function generateSecureRandom(min, max, callback) {
  crypto.randomBytes(8, function(ex, buf) {
    if (ex) { throw ex }

    var integer = parseInt(buf.toString('hex'), 16) // Convert to integer. Need double the number of bytes.
    var random = Math.round(integer / 0xffffffffffffffff * (max - min) + min) // Normalize the number between 0 to 1 and then scale it to the correct range
    callback(random) // crypto.randomBytes is asynchronous so we need to return the random number as a callback
  })
}

/**
 * Models mathematical Polynomials with real valued coefficients.
 * @constructor
 * @param {array} coefficients An array of the coffeficients of the Polynomial ordered by index, ascending.
 */
function Polynomial(coefficients) {
  if (typeof coefficients === 'object') {
    this.coefficients = coefficients
  } else {
    console.error(new Error('The coefficients of a Polynomial must be an array.'))
    this.coefficients = []
  }
}

/**
 * Calculates the value of a Polynomial at a specific point.
 * @param  {number} point The point the Polynomial should be evaluated at.
 * @return {number}       The value of the Polynomial at the point.
 */
Polynomial.prototype.evaluate = function(point) {
  var value = 0
  for (var i = 0; i < this.coefficients.length; ++i) {
    value += this.coefficients[i] * Math.pow(point, i)
  }
  return value
}

/**
 * Generates a polynomial of specified order with cryptographically secure random coefficients.
 * @param  {int}   order    The order of the polynomial.
 * @param  {Function} callback The callback function with one parameter, namely the random polynomial.
 */
function generatePolynomial(order, callback) {
  var coefficients = []

  function addCoefficient(num) {
    coefficients.push(num)
    if(coefficients.length === order) {
      var output = new Polynomial(coefficients)
      callback(output)
    }
  }

  for (var i = 0; i < order; ++i) {
    generateSecureRandom(100000000, 999999999, addCoefficient)
  }
}

/**
 * Inputs numKeys points into the polynomial and returns the values to create keys.
 * @param  {number} numKeys    The number of keys that should be generated.
 * @param  {Polynomial} polynomial The polynomial used to generate the keys.
 * @return {array}            An array of keys to be given to the user.
 */
function generateKeys(numKeys, polynomial) {
  var keys = []

  for (var i = 2; i < numKeys + 2; ++i) {
    keys.push(polynomial.evaluate(i))
  }

  return keys
}
