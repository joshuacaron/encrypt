var express = require('express')
var bodyParser = require('body-parser')
var encrypt = require('./lib/encrypt.js')
var helmet = require('helmet')
var csp = require('helmet-csp')

var app = express()

app.use(helmet())

app.use(csp({
  defaultSource: ["'self'"],
  sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
  scriptSource: ["'self'", 'ajax.googleapis.com'],
  connectSource: ["'self'"]
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'))
app.use('/', express.static('public'))

app.post('/api/encrypt', function(req, res) {
  var numKeys = parseInt(req.body.numKeys.trim())
  var numDecryptKeys = parseInt(req.body.numDecryptKeys.trim())
  var message = req.body.message.trim()

  if (numKeys < numDecryptKeys) {
    res.send('<p>The number of encryption keys must be at least as ' +
     'many as the number of keys to decrypt the message.</p>')
  } else if (numKeys <= 0 || numDecryptKeys <= 0) {
    res.send('<p>You must have at least one key.</p>')
  }

  encrypt.encrypt(numKeys, numDecryptKeys, message)
  .then(function(output) {
    res.send(output)
  })
  .catch(function(error) {
    res.send('<p>There was an error encrypting your message see: ' + error + '</p>')
  })

})

app.post('/api/decrypt', function(req, res) {
  var keys = req.body.keys.trim()
  var message = req.body.encryptedmessage.trim()

  encrypt.decrypt(keys, message)
  .then(function(output) {
    res.send(output)
  })
  .catch(function(error) {
    res.send('<h4>Your keys or message were entered incorrectly.</h4>')
  }, /bad decrypt/)
  .catch(function(error) {
    res.send('Error: ' + error)
  })
})

app.listen(3000)
console.log('listening on port 3000')
