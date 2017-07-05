'use strict'

const Lodash = require('lodash')
const check = require('../../argument-validator').check

const STATUS_ACTIVE = 'active'
const STATUS_INACTIVE = 'inactive'
const STATUS_DELETED = 'deleted'
const ENUM_STATUSES = [ STATUS_ACTIVE, STATUS_INACTIVE, STATUS_DELETED ]

module.exports = function () {
  var si = this

  si.add('role:warehouse, cmd:add', function (args, done) {
    check(args, done)
      .arg('name').required().string().min(2)
      .arg('phone').optional().default('').string()
      .arg('email').optional().default('').string().isEmail()
      .arg('address').optional().default('').string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_warehouse_entity(process.env.COMPANY)

        data.created_at = new Date
        data.updated_at = new Date
        entity.data$(data).save$(function (err, warehouse) {
          if (err) throw err

          reply({ warehouse: warehouse })
        })
      })
  })

  si.add('role:warehouse, cmd:update', function (args, done) {
    check(args, done)
      .arg('id').required()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string()
      .arg('email').optional().isEmail()
      .arg('address').optional().string()
      .arg('status').optional().inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_warehouse_entity(process.env.COMPANY)

        entity.load$(data.id, function (err, updatedWarehouse) {
          if (err) throw err

          if (!updatedWarehouse) return done(null, { ok: false, why: 'not-found' })

          data.updated_at = new Date
          updatedWarehouse.data$(data)
          if (updatedWarehouse.status === STATUS_DELETED) {
            updatedWarehouse.deleted_at = new Date
          }
          updatedWarehouse.save$(function (err, respond) {
            if (err) throw err

            reply({ warehouse: respond })
          })
        })
      })
  })

  si.add('role:warehouse, cmd:delete', function (args, done) {
    this.act('role:warehouse, cmd:update', { id: args.id, status: STATUS_DELETED }, done);
  })

  si.add('role:warehouse, cmd:restore', function (args, done) {
    this.act('role:warehouse, cmd:update', { id: args.id, status: STATUS_ACTIVE }, done);
  })

  si.add('role:warehouse, cmd:find', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string()
      .arg('email').optional().isEmail()
      .arg('address').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_warehouse_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.load$(query, function (err, warehouse) {
          if (err) throw err

          reply({ warehouse: warehouse })
        })
      })
  })

  si.add('role:warehouse, cmd:get', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string()
      .arg('email').optional().isEmail()
      .arg('address').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_warehouse_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.list$(query, function (err, warehouses) {
          if (err) throw err

          reply({ warehouses: warehouses })
        })
      })
  })

  function make_warehouse_entity (company) {
    return si.make(company, 'company', 'warehouse')
  }

  return 'warehouse'
}
