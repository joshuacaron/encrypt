var Polynomial = require('./lib/polynomial.js')
var crypto = require('./lib/crypto-functions.js')
var keys = require('./lib/keys.js')
var express = require('express')

var app = express()

app.get('/', function(req, res) {
  res.end('hi')
})

app.listen(3000)
console.log('listening on port 3000')
