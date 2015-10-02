var keys = require('./../lib/keys.js')
var Polynomial = require('./../lib/polynomial.js')
var assert = require('assert')
var _ = require('lodash')

describe('Keys', function() {
  describe('generatePolynomial(order)', function() {
    it('should return a polynomial', function(done) {
      keys.generatePolynomial(2)
      .then(function(p) {
        assert(p instanceof Polynomial)
        done()
      })
    })

    it('should have the correct order', function(done) {
      keys.generatePolynomial(5)
      .then(function(p) {
        assert.equal(p.order, 5)
        done()
      })
    })

    it('should all positive terms', function(done) {
      keys.generatePolynomial(4)
      .then(function(p) {
        var positive = true

        for (var i = 0; i < p.coefficients.length; ++i) {
          if (p.coefficients[i] < 0) {
            positive = false
          }
        }

        assert(positive)
        done()
      })
    })

  })

  describe('generateKeys(numKeys, numToDecrypt)', function() {
    it('should return an array of keys', function(done) {
      keys.generateKeys(4, 2)
      .then(function(keys) {
        assert(keys instanceof Array)
        done()
      })
    })

    it('should return the specified number of keys', function(done) {
      keys.generateKeys(5, 5)
      .then(function(keys) {
        assert.equal(keys.length, 5)
        done()
      })
    })

    it('should return unique keys', function(done) {
      keys.generateKeys(5, 1)
      .then(function(keys) {
        assert.deepEqual(_.unique(keys), keys)
        done()
      })
    })
  })

})
