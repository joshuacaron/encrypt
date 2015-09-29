/**
 * Module containing all the cryptographic helper functions.
 * @module
 */

var crypto = require('crypto')

var algorithm = 'aes-256-cbc'

/**
 * Encrypts a string with the globally set algorithm and password.
 * @param  {string} msg The message to be encrypted.
 * @return {string}     The hex value of the encrypted message.
 */
function encrypt(msg, password) {
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
function decrypt(msg, password) {
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
 */
function generateSecureRandom(min, max, callback) {
  return new Promise(function(resolve, reject){
    crypto.randomBytes(8, function(ex, buf) {
      if (ex) { throw ex }

      var integer = parseInt(buf.toString('hex'), 16) // Convert to integer. Need double the number of bytes.
      var random = Math.round(integer / 0xffffffffffffffff * (max - min) + min) // Normalize the number between 0 to 1 and then scale it to the correct range
      resolve(random) // crypto.randomBytes is asynchronous so we need to return the random number as a callback
    })
  })
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt,
  generateSecureRandom: generateSecureRandom
}
