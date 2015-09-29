var assert = require('assert')
var Polynomial = require('./../lib/polynomial.js')

describe('Polynomial', function() {
  describe('new Polynomial(coefficients)', function() {
    it('should have have instanceof Polynomial and be type object', function() {
      var x = new Polynomial([1,2,3])
      assert.equal(typeof x,'object')
      assert.equal(x instanceof Polynomial, true)
    })

    it('should convert constant arguments into an array with one argument', function() {
      var x = new Polynomial(1)
      assert.deepEqual(x.coefficients, [1])
    })
  })

  describe('.coefficients', function() {
    it('should be an array', function() {
      var x = new Polynomial([1,2,3])
      assert.equal(x.coefficients instanceof Array, true)
    })

    it('should be equal to the input array', function() {
      var x = new Polynomial([1,2,3])
      assert.deepEqual(x.coefficients, [1,2,3])
    })
  })

  describe('.evaluate(value)', function() {
    it('should return a number', function() {
      var x = new Polynomial([1,2,3])
      var temp = x.evaluate(1)
      assert.equal(typeof temp, 'number')
    })

    it('should be equal to the constant when evaluated at zero', function() {
      var x = new Polynomial([1,2,3])
      var y = new Polynomial([5,2,1])
      assert.equal(x.evaluate(0), 1)
      assert.equal(y.evaluate(0), 5)
    })

    it('should return the correct value when evaluated', function() {
      var x = new Polynomial([-1,3,17,2])
      assert.equal(x.evaluate(1), 21)
      assert.equal(x.evaluate(2), 89)
      assert.equal(x.evaluate(-2), 45)
    })
  })

  describe('.scalarMult(constant)', function() {
    it('should not modify the polynomial when multiplying by 1', function() {
      var x = new Polynomial([5,2,-1])
      x.scalarMult(1)
      assert.deepEqual(x.coefficients, [5,2,-1])
    })

    it('should be constant at 0 when multiplying by 0', function() {
      var x = new Polynomial([7,-1,17,15])
      x.scalarMult(0)
      assert.deepEqual(x.coefficients, [0])
    })

    it('should scale all the coefficients by the constant', function() {
      var x = new Polynomial([0,1,4,-1])
      x.scalarMult(2)
      assert.deepEqual(x.coefficients, [0, 2, 8, -2])
    })
  })

  describe('.add(poly1, poly2)', function() {
    it('should return the other polynomial if one is constant at 0', function() {
      var x = new Polynomial([0])
      var y = new Polynomial([1,4,5])
      var z = Polynomial.add(x, y)
      assert.deepEqual(z, y)
    })

    it('should not have trailing zeros in the resulting polynomial', function() {
      var x = new Polynomial([2,1,1])
      var y = new Polynomial([-1,-1,-1])
      var z = new Polynomial([1])
      assert.deepEqual(Polynomial.add(x,y), z)
    })

    it('should add 2 polynomials by adding like coefficients', function() {
      var x = new Polynomial([5,7,-4])
      var y = new Polynomial([3,1,2])
      var z = new Polynomial([8,8,-2])
      assert.deepEqual(Polynomial.add(x,y), z)
    })
  })
})
