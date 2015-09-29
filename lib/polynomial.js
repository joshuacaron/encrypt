'use strict'

/**
 * Module dealing with polynomials and operations on them.
 * @module
 */

/**
 * Models mathematical Polynomials with real valued coefficients.
 * @constructor
 * @param {array} coefficients An array of the coffeficients of the Polynomial ordered by index, ascending.
 */
class Polynomial {
  constructor(coefficients) {
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
  evaluate(point) {
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
  scalarMult(constant) {
    if (constant === 0) {
      this.coefficients = [0]
    } else {
      for (var i = 0; i < this.coefficients.length; ++i) {
        this.coefficients[i] = this.coefficients[i] * constant
      }
    }
  }

  /**
   * Adds two polynomials, poly1 and poly2, and returns a new polynomial
   * @param {Polynomial} poly1 The first polynomial.
   * @param {Polynomial} poly2 The second polynomial.
   * @return {Polynomial} The sum of the two polynomials and componentwise.
   */
  static add(poly1, poly2) {
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
}

module.exports = Polynomial
