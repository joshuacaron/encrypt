/**
 * Module dealing with polynomials and operations on them.
 * @module
 */

/**
 * Models mathematical Polynomials with real valued coefficients.
 * @constructor
 * @param {array} coefficients An array of the coffeficients of the Polynomial ordered by index, ascending.
 */
function Polynomial(coefficients) {
  if (typeof coefficients === 'object') {
    this.coefficients = coefficients
  } else if (typeof coefficients === 'number') {
    this.coefficients = [coefficients]
  } else if (typeof coefficients === 'undefined') {
    this.coefficients = []
  } else {
    throw new Error('The coefficients of a Polynomial must be an array.')
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
 * Multiples the polynomial by a constant.
 * @param  {number} constant Scalar value to multiply the polynomial by.
 */
Polynomial.prototype.scalarMult = function(constant) {
  if (constant === 0) {
    this.coefficients = [0]
  } else {
    for (var i = 0; i < this.coefficients.length; ++i) {
      this.coefficients[i] = this.coefficients[i] * constant
    }
  }
}

module.exports = Polynomial
