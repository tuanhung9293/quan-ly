'use strict'

module.exports = function () {
  var si = this

  const CODE_DEFAULT_PREFIX = '268'
  const CODE_CHARS = '0123456789'

  function generate_code (prefix) {
    var code = prefix || CODE_DEFAULT_PREFIX
    while (code.length < 12) {
      code += CODE_CHARS[ Math.floor(Math.random() * 1000000) % CODE_CHARS.length ]
    }
    return code
  }

  function get_EAN13_checksum_digit (data) {
    var sumOfEven = data.toString().split('').filter(function (item, index) {
      if (index % 2 === 0) return item
    }).reduce(function (c, d) {
      return parseInt(c) + parseInt(d)
    }, 0)

    var sumOfOdd = data.toString().split('').filter(function (item, index) {
      if (index % 2 !== 0) return item
    }).reduce(function (c, d) {
      return parseInt(c) + parseInt(d)
    }, 0)

    if ((sumOfEven + 3 * sumOfOdd) % 10 === 0) return 0

    return 10 - (sumOfEven + 3 * sumOfOdd) % 10
  }

  si.add('role:barcode, cmd:generate', function (args, done) {
    var a = generate_code(args.code)
    var b = get_EAN13_checksum_digit(a)
    args.code = a + b.toString()
    return done(null, { ok:true, id: args.code })
  })

  si.add('role:barcode, cmd:check', function (args, done) {
    if ((args.code).length !== 13) return done(null, { ok: false, why: 'invalid-code' })
    var a = (args.code).substr(-1)
    var b = get_EAN13_checksum_digit((args.code).slice(0, 12))
    if (parseInt(a) !== b) return done(null, { ok: false, why: 'invalid-code' })
    return done(null, { ok: true, id: args.code })
  })

  return 'barcode'
}
