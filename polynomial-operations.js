/**
 * Module dealing with operations on polynomials
 * @module
 */

var Polynomial = require('./polynomial.js')

/**
 * Adds two polynomials, poly1 and poly2, and returns a new polynomial
 * @param {Polynomial} poly1 The first polynomial.
 * @param {Polynomial} poly2 The second polynomial.
 * @return {Polynomial} The sum of the two polynomials and componentwise.
 */
function add(poly1, poly2) {
  var coefficients = []

  var p1 = new Polynomial(poly1.coefficients)
  var p2 = new Polynomial(poly2.coefficients)

  for (var i = 0; i < Math.max(p1.coefficients.length, p2.coefficients.length); ++i) {
    if (p1.coefficients[i] === undefined) {
      p1.coefficients.push(0)
    }
    if (p2.coefficients[i] === undefined) {
      p2.coefficients.push(0)
    }
    var sum = p1.coefficients[i] + p2.coefficients[i]
    coefficients.push(sum)
  }

  // Strip trailing zeroes
  var trailingZeroes = true
  for (var j = coefficients.length - 1; j > 0; --j) {
    if (coefficients[j] === 0 && trailingZeroes) {
      coefficients.pop()
    } else {
      trailingZeroes = false
    }
  }

  var output = new Polynomial(coefficients)
  return output
}

module.exports = {
  add: add
}
