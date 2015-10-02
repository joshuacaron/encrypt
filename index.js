var express = require('express')
var bodyParser = require('body-parser')
var encrypt = require('./encrypt.js')

var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.use('/bootstrap', express.static('bootstrap'))
app.use('/css', express.static('css'))
app.use('/scripts', express.static('scripts'))

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname})
})

app.post('/api/encrypt', function(req, res) {
  var numKeys = parseInt(req.body.numKeys.trim())
  var numDecryptKeys = parseInt(req.body.numDecryptKeys.trim())
  var message = req.body.message.trim()

  if (numKeys < numDecryptKeys) {
    res.send('<p>The number of encryption keys must be at least as many as the number of keys to decrypt the message.</p>')
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
