$(document).ready(function() {
  // Keeps line breaks when taking val. Necessary to parse keys properly.
  $.valHooks.textarea = {
    get: function(elem) {
      return elem.value.replace(/\r?\n/g, '\r\n')
    }};

  $('#submitEncrypt').click(function(e) {
    e.preventDefault()
    var data = {}
    data.numKeys = $('#numKeys').val()
    data.numDecryptKeys = $('#numDecryptKeys').val()
    data.message = $('#messageEncrypt').val()
    $.post('/api/encrypt', data, function(output) {
      $('#output').html(output)
      $('#output').addClass('output')
    })
  })

  $('#submitDecrypt').click(function(e) {
    e.preventDefault()
    var data = {}
    data.encryptedmessage = $('#encryptedmessage').val()
    data.keys = $('#keys').val()

    $.post('/api/decrypt', data, function(output) {
      $('#output').html(output)
      $('#output').addClass('output')
    })
  })
})
