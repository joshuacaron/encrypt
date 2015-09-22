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

Polynomial.prototype.scalarMult = function(constant) {
  for (var i = 0; i < this.coefficients.length; ++i) {
    this.coefficients[i] = this.coefficients[i] * constant
  }
}

function addPolynomials(poly1, poly2) {
  var coefficients = []
  for (var i = 0; i < poly1.coefficients.length; ++i) {
    var sum = poly1.coefficients[i] + poly2.coefficients[i]
    coefficients.push(sum)
  }

  var output = new Polynomial(coefficients)
  return output
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
    if (coefficients.length === order) {
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
    var key = numDecryptKeys + 'x' + i + 'y' + polynomial.evaluate(i).toString(16)
    keys.push(key)
  }

  return keys
}

/**
 * Clones an array and returns a new one with the same values.
 * @param  {array} array The array to be cloned.
 * @return {array}       The new duplicate array.
 */
function cloneArray(array) {
  var output = []
  for (var i = 0; i < array.length; ++i) {
    output.push(array[i])
  }
  return output
}

/**
 * Checks if two arrays are equal or not and returns a boolean.
 * @param  {array} ar1 The first array to test.
 * @param  {array} ar2 The second array to test.
 * @return {boolean}     Returns true if they have the same values, and false otherwise.
 */
function compareArrays(ar1, ar2) {
  if (ar1.length !== ar2.length) {
    return false
  } else {
    for (var i = 0; i < ar1.length; ++i) {
      if (ar1[i] !== ar2[i]) {
        return false
      }
    }
    return true
  }
}

/**
 * Iterates the indices so that no two indices are the same. Helper function for combinations.
 * @param  {array} indices The current indices.
 * @param  {number} maxSize The maximum value that an index can have before the previous one needs to be updated instead.
 * @param {number} omitIndex The index to omit from the combination.
 * @return {array}         The updated indices.
 */
function iterateIndices(indices, maxSize, omitIndex) {
  for (var i = indices.length - 1; i >= 0; --i) {
    if (i !== omitIndex) {
      if (indices[i] <= maxSize - (indices.length - i)) {
        indices[i] += 1

        for (var j = i + 1; j < indices.length - 1; ++j) {
          if (j !== omitIndex && j - 1 !== omitIndex) {
            indices[j] = indices[j - 1] + 1
          }
          else if (j - 1 == omitIndex && j - 2 >= 0) {
            indices[j] = indices[j - 2]
          }
          else {
            indices[j] = 0
          }
        }

        return indices
      }
    }
  }
  return indices
}

/**
 * Recursively creates sums up n-wise multiples from an array.
 * @param  {number} currentSum Tracks the current sum so it can be iterated on recursively.
 * @param  {array} array      The array that the values are pulled from.
 * @param  {array} indices    Tracks the indices to pick all combinations to be multiplied.
 * @param {number} omitIndex The index to omit from the combination.
 * @return {number}            currentSum after the recursion ends. The sum of all the combinations.
 */
function combinationsHelper(currentSum, array, indices, omitIndex) {
  console.log(currentSum + ' ' + array + ' ' + indices)
  var oldIndices = cloneArray(indices)
  var temp = 1
  for (var i = 0; i < indices.length; ++i) {
    temp = temp * array[indices[i]]
  }
  currentSum += temp
  iterateIndices(indices, array.length - 1, omitIndex)

  console.log('indices: ' + indices + ' ' + oldIndices)

  if (!compareArrays(indices, oldIndices)) {
    return combinationsHelper(currentSum, array, indices)
  } else {
    return currentSum
  }
}

/**
 * A simple wrapper for combinationsHelper to hide the recursion and make the api more obvious.
 *
 * @example
 *  combinations([1,2,3], 2) // 1*2 + 1*3 + 2*3
 *  // 11
 * @param  {array} array The array that values are pulled from.
 * @param  {number} n     The number of values to be multiplied at once.
 * @param  {number} omitIndex The index to omit from the combination.
 * @return {number}       The total sum of all the multiplied groups.
 */
function combinations(array, n, omitIndex) {
  var indices = []
  for (var i = 0; i < n; ++i) {
    indices.push(i)
  }
  return combinationsHelper(0, array, indices, omitIndex)
}

/**
 * Creates a lagrange basis polynomial for a specified index in the array.
 * @param  {array} array The index with the x-values to be used in generating the polynomial.
 * @param  {number} index The index to start at.
 * @return {Polynomial}       The corresponding polynomial.
 */
function createLagrangeBasisPolynomial(array, index) {
  var divisor = 1;
  for (var i = 0; i < array.length; ++i) {
    if (i !== index) {
      divisor = divisor * (array[index] - array[i])
    }
  }

  var coefficients = []

  for (var j = 0; j < array.length; ++j) {
    var temp = combinations(array, array.length - j, index) / divisor

    if ((array.length - i) % 2 === 1) {
      temp = -1 * temp
    }

    coefficients.push(temp)
  }

  return new Polynomial(coefficients)
}

function interpolate(xs, ys, order) {
  var coefficients = []
  for (var i = 0; i < order + 1; ++i) {
    coefficients.push(0)
  }

  var output = new Polynomial(coefficients)

  for (var j = 0; j < order + 1; ++j) {
    var lbp = createLagrangeBasisPolynomial(xs, j)
    console.log(lbp)
    lbp.scalarMult(ys[j])
    output = addPolynomials(output, lbp)
  }

  return output
}
