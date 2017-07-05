'use strict'

const Lodash = require('lodash')
const Constants = require('../lib/constants')
const check = require('../../argument-validator').check

const STATUS_ACTIVE = Constants.STATUS_ACTIVE
const STATUS_INACTIVE = Constants.STATUS_INACTIVE
const STATUS_DELETED = Constants.STATUS_DELETED
const ENUM_STATUSES = Constants.ENUM_STATUSES

module.exports = function () {
  var si = this

  si.add('role:employee, cmd:add', function (args, done) {
    check(args, done)
      .arg('email').required().string().isEmail()
      .arg('name').required().string().min(2)
      .arg('phone').required().string()
      .arg('address').optional().default('').string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_employee_entity(process.env.COMPANY)
        data.email = data.email.trim().toLowerCase()
        entity.load$({ email: data.email }, function (err, employee) {
          if (employee && employee.status != STATUS_DELETED) return done(null, { ok: false, why: 'email-exists' })
          data.created_at = new Date
          data.updated_at = new Date
          entity.data$(data).save$(function (err, employee) {
            if (err) throw err
            reply({ employee: employee })
          })
        })
      })
  })

  si.add('role:employee, cmd:update', function (args, done) {
    check(args, done)
      .arg('id').required()
      .arg('email').optional().string().isEmail()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string()
      .arg('address').optional().string()
      .arg('status').optional().inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_employee_entity(process.env.COMPANY)

        entity.load$(data.id, function (err, updatedEmployee) {
          if (err) throw err

          if (!updatedEmployee) return done(null, { ok: false, why: 'not-found' })

          if(data.email) data.email = data.email.trim().toLowerCase()
          entity.load$({ email: data.email, status: STATUS_ACTIVE }, function (err, employee) {
            if (employee && data.id != employee.id) return done(null, { ok: false, why: 'email-exists' })
            data.updated_at = new Date
            updatedEmployee.data$(data)
            if (updatedEmployee.status === STATUS_DELETED) {
              updatedEmployee.deleted_at = new Date
            }
            updatedEmployee.save$(function (err, respond) {
              if (err) throw err

              reply({ employee: respond })
            })
          })
        })
      })
  })

  si.add('role:employee, cmd:delete', function (args, done) {
    this.act('role:employee, cmd:update', { id: args.id, status: STATUS_DELETED }, done)
  })
  /*
   si.add('role:employee, cmd:restore', function (args, done) {
   this.act('role:employee, cmd:update', { id: args.id, status: STATUS_ACTIVE }, done)
   })
   */
  si.add('role:employee, cmd:find', function (args, done) {
    check(args, done)
      .arg('query').optional().default({ sort$: { id: 1 } }).object()
      .arg('id').optional()
      .arg('email').optional().string().isEmail()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string()
      .arg('address').optional().string()
      .arg('status').optional().inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_employee_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.load$(query, function (err, employee) {
          if (err) throw err

          reply({ employee: employee })
        })
      })
  })

  si.add('role:employee, cmd:get', function (args, done) {
    check(args, done)
      .arg('query').optional().default({ sort$: { id: 1 } }).object()
      .arg('id').optional()
      .arg('email').optional().string().isEmail()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string()
      .arg('address').optional().string()
      .arg('status').optional().inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_employee_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.list$(query, function (err, employees) {
          if (err) throw err

          reply({ employees: employees })
        })
      })
  })

  function make_employee_entity (company) {
    return si.make(company, 'company', 'employee')
  }

  return 'employee'
}
