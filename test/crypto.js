var m = require('./../lib/crypto-functions.js')
var assert = require('assert')

describe('Cryptographic functions', function() {

  describe('encrypt(message, password)', function() {
    it('should return a hex string', function() {
      var a = m.encrypt('test123', 'password123')
      var b = m.encrypt('lorum ipsum dolor sit amet...', 'password')
      assert(a.match(/[a-f0-9]+/)[0] === a)
      assert(b.match(/[a-f0-9]+/)[0] === b)
      assert.equal(typeof a, 'string')
      assert.equal(typeof b, 'string')
    })

    it('should be different for different passwords', function() {
      var a = m.encrypt('test123', 'password123')
      var b = m.encrypt('test123', 'password')
      assert.notEqual(a, b)
    })

    it('should be different for different inputs', function() {
      var a = m.encrypt('hi', 'password')
      var b = m.encrypt('hello', 'password')
      assert.notEqual(a, b)
    })

    it('should be the same for the same input and password', function() {
      var a = m.encrypt('hi', 'password')
      var b = m.encrypt('hi', 'password')
      assert.equal(a, b)
    })
  })

  describe('decrypt(message, password)', function() {
    before(function() {
      x = m.encrypt('test123', 'password123')
      y = m.encrypt('lorum ipsum dolor sit amet...', 'password')
    })

    it('should return a UTF-8 string', function() {
      var a = m.decrypt(x, 'password123')
      assert.equal(typeof a, 'string')
      assert.notEqual(a, x)
    })

    it('should return the same value for the smae input and password', function() {
      var a = m.decrypt(y, 'password')
      var b = m.decrypt(y, 'password')
      assert.equal(a, b)
    })

    it('should throw an error if the password is wrong', function() {
      assert.throws(function() {
        m.decrypt(x, 'test')
      }, /bad decrypt/)
      assert.throws(function() {
        m.decrypt(y, 'password123')
      }, /bad decrypt/)
    })

    it('should return the original string if the password is correct', function() {
      var a = m.decrypt(x, 'password123')
      var b = m.decrypt(y, 'password')
      assert.equal(a, 'test123')
      assert.equal(b, 'lorum ipsum dolor sit amet...')
    })
  })

  describe('generateSecureRandom(min, max)', function() {
    it('should return a number', function(done) {
      m.generateSecureRandom(0, 10)
      .then(function(num) {
        assert.equal(typeof num, 'number')
        done()
      })
    })

    it('should return a number in the specified range', function(done) {
      m.generateSecureRandom(0, 10)
      .then(function(num) {
        assert(num <= 10 && num   >= 0)
        done()
      })
    })

    it('should work with negative values', function(done) {
      m.generateSecureRandom(-1000,-900)
      .then(function(num) {
        assert(num >= -1000 && num <= -900)
        done()
      })
    })

  })
})
