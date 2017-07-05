'use strict'

const Lodash = require('lodash')
const check = require('../../argument-validator').check
const Constants = require('../lib/constants')

const STATUS_ACTIVE = Constants.STATUS_ACTIVE
const ENUM_STATUSES = Constants.ENUM_STATUSES

module.exports = function () {
  const si = this

  si.add('role:company, cmd:add', function (args, done) {
    check(args, done)
      .arg('hostname').required().string().min(2)
      .arg('full_name').required().string().min(2)
      .arg('short_name').optional().string()
      .arg('brand_name').optional().string()
      .arg('address').optional().string()
      .arg('phone').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_company_entity(process.env.COMPANY)

        entity.load$({ hostname: data.hostname }, function (err, respond) {
          if (err) throw err

          if (respond) return done(null, { ok: false, why: 'company-existing' })

          data.created_at = new Date
          data.updated_at = new Date

          entity.data$(data).save$(function (err, company) {
            if (err) throw err

            reply({ company: company })
          })
        })
      })
  })

  si.add('role:company, cmd:update', function (args, done) {
    check(args, done)
      .arg('id').required()
      .arg('hostname').optional().string().min(2)
      .arg('full_name').optional().string().min(2)
      .arg('short_name').optional().string()
      .arg('brand_name').optional().string()
      .arg('address').optional().string()
      .arg('phone').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_company_entity(process.env.COMPANY)

        entity.load$({ id: data.id }, function (err, updatedCompany) {
          if (err) throw err

          if (!updatedCompany) return done(null, { ok: false, why: 'not-found' })

          entity.load$({ hostname: data.hostname }, function (err, respond) {
            if (err) throw err

            if (respond && respond.id !== data.id) return done(null, { ok: false, why: 'company-existing' })

            data.updated_at = new Date
            updatedCompany.data$(data).save$(function (err, respond) {
              if (err) throw err

              reply({ company: respond })
            })
          })
        })
      })
  })

  si.add('role:company, cmd:find', function (args, done) {
    check(args, done)
      .arg('query').optional().default({ sort$: { id: 1 } }).object()
      .arg('id').optional()
      .arg('hostname').optional().string().min(2)
      .arg('full_name').optional().string().min(2)
      .arg('short_name').optional().string()
      .arg('brand_name').optional().string()
      .arg('address').optional().string()
      .arg('phone').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_company_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.load$(query, function (err, company) {
          if (err) throw err

          reply({ company: company })
        })
      })
  })

  function make_company_entity (company) {
    return si.make(company, undefined, 'companies')
  }

  return 'company'
}