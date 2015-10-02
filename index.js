var crypto = require('./lib/crypto-functions.js')
var keys = require('./lib/keys.js')
var express = require('express')
var bodyParser = require('body-parser')
var Polynomial = require('./lib/polynomial.js')

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname})
})

app.post('/api/encrypt', function(req, res) {
  var numKeys = parseInt(req.body.numKeys)
  var numDecryptKeys = parseInt(req.body.numDecryptKeys)
  var message = req.body.message
  keys.generateKeys(numKeys, numDecryptKeys)
  .then(function(keys) {
    res.write(crypto.encrypt(message, keys.polynomial.coefficients[0].toString()))

    for (var i = 0; i < keys.length; ++i) {
      res.write('\r\n' + keys[i])
    }

    res.end()
  })
  .catch(function(error) {
    console.error(error)
  })
})

app.post('/api/decrypt', function(req, res) {
  var keys = req.body.keys
  var message = req.body.encryptedmessage

  keys = keys.split('\r\n')

  var xs = []
  var ys = []
  var split = []
  for (var i = 0; i < keys.length; ++i) {
    split.push(keys[i].split('.'))
  }
  var numKeys = parseInt(split[0][0])
  console.log(split)
  for (var j = 0; j < numKeys; ++j) {
    xs.push(parseInt(split[j][1]))
    ys.push(parseInt(split[j][2], 16))
  }
  var key = Polynomial.interpolate(xs,ys).toString()
  console.log(key)
  res.write(crypto.decrypt(message,key))
  res.end()
})

app.listen(3000)
console.log('listening on port 3000')
