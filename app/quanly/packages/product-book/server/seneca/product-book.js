'use strict'

const check = require('../../../argument-validator').check
const Lodash = require('lodash')

const BOOK_UNITS = [ 'unit', 'bulk' ]
const costDiscountRateCondition = 'cost_discount_rate-must-be-higher-than-price_discount_rate'
const defaultPriceCondition = 'default_price-must-be-higher-price'
const costCondition = 'cost-must-be-less-than-or-equal-price'

module.exports = function () {
  var si = this

  si.add('role:product, hook:price-calc, type:book', function (args, done) {
    var data = args.data
    if (data.price_discount_rate > data.cost_discount_rate) {
      return done(null, { ok: false, why: costDiscountRateCondition })
    }

    if (data.price > data.default_price) {
      return done(null, { ok: false, why: defaultPriceCondition })
    }

    if (data.cost > data.price) {
      return done(null, { ok: false, why: costCondition })
    }
    return done(null, { ok: true, data: data })
  })

  si.add('role:product, cmd:add, type:book', function (args, done) {
    var self = this
    check(args, done)
      .arg('default_price').required().double()
      .arg('cost_discount_rate').required().float()
      .arg('price_discount_rate').required().float()
      .arg('unit').optional().default('unit').inArray(BOOK_UNITS)
      .arg('cost').optional().double()
      .arg('price').optional().double()
      .then(function (data, reply) {
        if (typeof data.price === 'undefined') {
          data.price = ((100 - parseFloat(data.price_discount_rate)) * data.default_price) / 100
        }

        if (typeof data.cost === 'undefined') {
          data.cost = ((100 - parseFloat(data.cost_discount_rate)) * data.default_price) / 100
        }

        if (data.price > data.default_price) {
          return done(null, { ok: false, why: defaultPriceCondition })
        }

        if (parseFloat(data.price_discount_rate) > parseFloat(data.cost_discount_rate)) {
          return done(null, { ok: false, why: costDiscountRateCondition })
        }

        self.prior(Lodash.assign({}, args, data), done)
      })
  })

  si.add('role:product, cmd:update, type:book', function (args, done) {
    var self = this
    check(args, done)
      .arg('default_price').optional().double()
      .arg('cost_discount_rate').optional().float()
      .arg('price_discount_rate').optional().float()
      .arg('unit').optional().inArray(BOOK_UNITS)
      .then(function (data, reply) {
        self.prior(Lodash.assign({}, args, data), done)
      })
  })

  si.add('role:product, cmd:find, type:book', function (args, done) {
    var self = this
    check(args, done)
      .arg('default_price').optional().double()
      .arg('cost_discount_rate').optional().float()
      .arg('price_discount_rate').optional().float()
      .arg('unit').optional().inArray([ 'unit' ])
      .then(function (data, reply) {
        self.prior(Lodash.assign({}, args, data), done)
      })
  })

  si.add('role:product, cmd:get, type:book', function (args, done) {
    var self = this
    check(args, done)
      .arg('default_price').optional().double()
      .arg('cost_discount_rate').optional().float()
      .arg('price_discount_rate').optional().float()
      .arg('unit').optional().inArray(BOOK_UNITS)
      .then(function (data, reply) {
        self.prior(Lodash.assign({}, args, data), done)
      })
  })

  return 'product-book'
}
