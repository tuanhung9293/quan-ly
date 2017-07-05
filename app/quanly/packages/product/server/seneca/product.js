'use strict'

const check = require('../../../argument-validator').check
const Lodash = require('lodash')

const STATUS_ACTIVE = 'active'
const STATUS_INACTIVE = 'inactive'
const STATUS_DELETED = 'deleted'
const ENUM_AVAILABLE_STATUSES = [ STATUS_ACTIVE, STATUS_INACTIVE ]
const ENUM_STATUSES = [ STATUS_ACTIVE, STATUS_INACTIVE, STATUS_DELETED ]
const ENUM_UNITS = [ 'unit', 'kg', 'liter', 'meter', 'centimeter' ]

module.exports = function () {
  var si = this

  si.add('role:product, hook:price-calc', function (args, done) {
    var productData = args.data
    if (productData.cost > productData.price) {
      return done(null, { ok: false, why: 'cost-must-be-less-than-or-equal-price' })
    }
    done(null, { ok: true, data: productData })
  })

  si.add('role:product, cmd:add', function (args, done) {
    var self = this
    check(args, done)
      .arg('id').optional().string()
      .arg('name').required().string().min(2)
      .arg('unit').optional().default('unit').inArray(ENUM_UNITS)
      .arg('cost').required().double()
      .arg('price').required().double()
      .arg('type').optional().default('default')
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_AVAILABLE_STATUSES)
      .then(function (data, reply) {
        var barcodeCmd = (typeof data.id === 'undefined') ? 'cmd:generate' : 'cmd:check'
        self.act('role:barcode, ' + barcodeCmd, { code: data.id }, function (err, respond) {
          if (respond.ok === false) return done(null, { ok: false, why: 'id-is-incorrect' })

          var entity = make_product_entity(process.env.COMPANY)
          data.id = respond.id
          data.created_at = new Date
          data.updated_at = new Date
          entity.load$({ id: data.id }, function (err, product) {
            if (err) throw err

            if (product) return done(null, { ok: false, why: 'product-existing' })

            var mergeData = Lodash.assign({}, args, data)
            delete mergeData.cmd
            delete mergeData.role
            entity.data$(mergeData)
            self.act('role:product, hook:price-calc', { type: entity.type, data: entity.data$() }, function (err, respond) {
              if (err || !respond.ok) return done(err, respond)

              entity.data$(respond.data).save$(function (err, product) {
                if (err) throw err

                reply({ product: product })
              })
            })
          })
        })
      })
  })

  si.add('role:product, cmd:update', function (args, done) {
    var self = this
    check(args, done)
      .arg('id').required()
      .arg('name').optional().string().min(2)
      .arg('unit').optional().inArray(ENUM_UNITS)
      .arg('cost').optional().double()
      .arg('type').optional().default('default')
      .arg('price').optional().double()
      .arg('status').optional().inArray(ENUM_AVAILABLE_STATUSES)
      .then(function (data, reply) {
        var entity = make_product_entity(process.env.COMPANY)
        entity.load$({ id: data.id }, function (err, updatedProduct) {
          if (err) throw err

          if (!updatedProduct) return done(null, { ok: false, why: 'not-found' })

          data.updated_at = new Date

          var mergeData = Lodash.assign({}, args, data)
          delete mergeData.cmd
          delete mergeData.role
          updatedProduct.data$(mergeData)

          self.act('role:product, hook:price-calc', { type: updatedProduct.type, data: updatedProduct.data$() }, function (err, respond) {
            if (err || !respond.ok) return done(err, respond)
            updatedProduct.data$(respond.data).save$(function (err, respond) {
              if (err) throw err

              reply({ product: respond })
            })
          })
        })
      })
  })

  si.add('role:product, cmd:delete', function (args, done) {
    check(args, done)
      .arg('id').required()
      .arg('type').optional().default('default')
      .then(function (data, reply) {
        var entity = make_product_entity(process.env.COMPANY)
        entity.load$(data.id, function (err, deletedProduct) {
          if (err) throw err

          if (!deletedProduct) return done(null, { ok: false, why: 'not-found' })
          data.status = STATUS_DELETED
          data.deleted_at = new Date
          var mergeData = Lodash.assign({}, args, data)
          deletedProduct.data$(mergeData)
          delete deletedProduct.cmd
          delete deletedProduct.role
          deletedProduct.data$(data).save$(function (err, respond) {
            if (err) throw err

            reply({ product: respond })
          })
        })
      })
  })

  si.add('role:product, cmd:find', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('unit').optional().inArray(ENUM_UNITS)
      .arg('type').optional().default('default')
      .arg('cost').optional().double()
      .arg('price').optional().double()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_product_entity(process.env.COMPANY)
        var mergeData = Lodash.assign({}, args, data)
        var query = Lodash.assign({}, data.query, mergeData)
        delete query.query
        delete query.cmd
        delete query.role
        entity.load$(query, function (err, product) {
          if (err) throw err

          reply({ product: product })
        })
      })
  })

  si.add('role:product, cmd:get', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('unit').optional().inArray(ENUM_UNITS)
      .arg('type').optional().default('default')
      .arg('cost').optional().double()
      .arg('price').optional().double()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_product_entity(process.env.COMPANY)
        var mergeData = Lodash.assign({}, args, data)
        var query = Lodash.assign({}, data.query, mergeData)
        delete query.query
        delete query.cmd
        delete query.role
        entity.list$(query, function (err, products) {
          if (err) throw err

          reply({ products: products })
        })
      })
  })

  function make_product_entity (company) {
    return si.make(company, 'company', 'product')
  }

  return 'product'
}
