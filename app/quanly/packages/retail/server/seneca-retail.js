'use strict'

const Lodash = require('lodash')
const check = require('../../argument-validator').check
const Constants = require('../lib/constants')

const STATUS_ACTIVE = Constants.STATUS_ACTIVE
const STATUS_INACTIVE = Constants.STATUS_INACTIVE
const STATUS_DELETED = Constants.STATUS_DELETED

const ENUM_AVAILABLE_STATUSES = Constants.ENUM_AVAILABLE_STATUSES
const ENUM_STATUSES = Constants.ENUM_STATUSES

module.exports = function () {
  var si = this

  si.add('role:retail, cmd:add', function (args, done) {
    check(args, done)
      .arg('name').required().string().min(2)
      .arg('phone').optional().default('').string()
      .arg('email').optional().default('').string().isEmail()
      .arg('address').optional().default('').string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_retail_entity(process.env.COMPANY)

        data.created_at = new Date
        data.updated_at = new Date
        entity.data$(data).save$(function (err, retail) {
          if (err) throw err

          reply({ retail: retail })
        })
      })
  })

  si.add('role:retail, cmd:update', function (args, done) {
    check(args, done)
      .arg('id').required()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string()
      .arg('email').optional().isEmail()
      .arg('address').optional().string()
      .arg('status').optional().inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_retail_entity(process.env.COMPANY)
        entity.load$(data.id, function (err, updatedRetail) {
          if (err) throw err

          if (!updatedRetail) return done(null, { ok: false, why: 'not-found' })

          data.updated_at = new Date
          updatedRetail.data$(data)
          if (updatedRetail.status === STATUS_DELETED) {
            updatedRetail.deleted_at = new Date
          }
          updatedRetail.save$(function (err, respond) {
            if (err) throw err
            reply({ retail: respond })
          })
        })
      })
  })

  si.add('role:retail, cmd:delete', function (args, done) {
    this.act('role:retail, cmd:update', { id: args.id, status: STATUS_DELETED }, done)
  })

  si.add('role:retail, cmd:restore', function (args, done) {
    this.act('role:retail, cmd:update', { id: args.id, status: STATUS_ACTIVE }, done)
  })

  si.add('role:retail, cmd:find', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string()
      .arg('email').optional().isEmail()
      .arg('address').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_retail_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.load$(query, function (err, retail) {
          if (err) throw err

          reply({ retail: retail })
        })
      })
  })

  si.add('role:retail, cmd:get', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string()
      .arg('email').optional().isEmail()
      .arg('address').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_retail_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.list$(query, function (err, retails) {
          if (err) throw err

          reply({ retails: retails })
        })
      })
  })

  function make_retail_entity (company) {
    return si.make(company, 'company', 'retail')
  }

  return 'retail'
}
