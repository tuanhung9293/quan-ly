'use strict'

const check = require('../../argument-validator').check
var Lodash = require('lodash')
const Constants = require('../lib/constants')

const STATUS_ACTIVE = Constants.STATUS_ACTIVE
const STATUS_DELETED = Constants.STATUS_DELETED
const ENUM_STATUSES = Constants.ENUM_STATUSES

module.exports = function () {
  var si = this

  si.add('role:product-quantity, cmd:add', function (args, done) {
    check(args, done)
      .arg('product_type').required().string()
      .arg('product_id').required().string()
      .arg('item_type').required().string()
      .arg('item_id').required()
      .arg('count').required().int()
      .arg('action').required().string()
      .arg('description').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_product_quantity_entity(process.env.COMPANY)
        data.created_at = new Date
        entity.data$(data).save$(function (err, productQuantity) {
          if (err) throw err

          reply({ productQuantity: productQuantity })
        })
      })
  })

  si.add('role:product-quantity, cmd:delete', function (args, done) {
    check(args, done)
      .arg('id').required()
      .then(function (data, reply) {
        var entity = make_product_quantity_entity(process.env.COMPANY)
        entity.load$({ id: data.id }, function (err, deletedProductQuantity) {
          if (err) throw err

          if (!deletedProductQuantity) return done(null, { ok: false, why: 'not-found' })

          data.deleted_at = new Date
          data.status = STATUS_DELETED
          deletedProductQuantity.data$(data).save$(function (err, respond) {
            if (err) throw err

            reply({ productQuantity: respond })
          })
        })
      })
  })

  si.add('role:product-quantity, cmd:get', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('product_id').optional().string()
      .arg('product_type').optional().string()
      .arg('count').optional().int()
      .arg('item_id').optional().string()
      .arg('item_type').optional().string()
      .arg('action').optional().string()
      .arg('description').optional().string()
      .arg('status').default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_product_quantity_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.list$(query, function (err, productQuantities) {
          if (err) throw err

          reply({ productQuantities: productQuantities })
        })
      })
  })

  function make_product_quantity_entity (company) {
    return si.make(company, 'product', 'quantities')
  }

  return 'product-quantity'
}