'use strict'

const check = require('../../../argument-validator').check
var Lodash = require('lodash')
var ObjectID = require('mongodb').ObjectID

const STATUS_ACTIVE = 'active'
const STATUS_INACTIVE = 'inactive'
const STATUS_DELETED = 'deleted'
const ENUM_AVAILABLE_STATUSES = [ STATUS_ACTIVE, STATUS_INACTIVE ]
const ENUM_STATUSES = [ STATUS_ACTIVE, STATUS_INACTIVE, STATUS_DELETED ]

module.exports = function () {
  var si = this
  si.add('role:customer, cmd:add', function (args, done) {
    check(args, done)
      .arg('name').required().string().min(2)
      .arg('phone').required().string().min(2)
      .arg('email').required().string().isEmail()
      .arg('address').optional().default('').string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_AVAILABLE_STATUSES)
      .then(function (data, reply) {
        var entity = make_customer_entity(process.env.COMPANY)
        data.created_at = new Date
        data.updated_at = new Date
        entity.data$(data).save$(function (err, customer) {
          if (err) throw err

          reply({ customer: customer })
        })
      })
  })

  si.add('role:customer, cmd:update', function (args, done) {
    check(args, done)
      .arg('id').required()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string().min(2)
      .arg('email').optional().isEmail()
      .arg('address').optional().string()
      .arg('status').optional().inArray(ENUM_AVAILABLE_STATUSES)
      .then(function (data, reply) {
        var entity = make_customer_entity(process.env.COMPANY)
        entity.load$(data.id, function (err, updatedCustomer) {
          if (err) throw err

          if (!updatedCustomer) return done(null, { ok: false, why: 'not-found' })
          data.updated_at = new Date
          updatedCustomer.data$(data).save$(function (err, respond) {
            if (err) throw err
            reply({ customer: respond })
          })
        })
      })
  })

  si.add('role:customer, cmd:delete', function (args, done) {
    check(args, done)
      .arg('id').required()
      .then(function (data, reply) {
        var entity = make_customer_entity(process.env.COMPANY)
        entity.load$(data.id, function (err, deletedCustomer) {
          if (err) throw err

          if (!deletedCustomer) return done(null, { ok: false, why: 'not-found' })
          data.status = STATUS_DELETED
          data.updated_at = new Date
          deletedCustomer.data$(data).save$(function (err, respond) {
            if (err) throw err

            reply({ customer: respond })
          })
        })
      })
  })

  si.add('role:customer, cmd:find', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string().min(2)
      .arg('email').optional().isEmail()
      .arg('address').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)

      .then(function (data, reply) {
        var entity = make_customer_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.load$(query, function (err, customer) {
          if (err) throw err

          reply({ customer: customer })
        })
      })
  })

  si.add('role:customer, cmd:get', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string().min(2)
      .arg('email').optional().isEmail()
      .arg('address').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)

      .then(function (data, reply) {
        var entity = make_customer_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.list$(query, function (err, customers) {
          if (err) throw err

          reply({ customers: customers })
        })
      })
  })

  si.add('role:customer, cmd:add-group', function (args, done) {
    check(args, done)
      .arg('name').required().string().min(2)
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_AVAILABLE_STATUSES)
      .then(function (data, reply) {
        var entity = make_customer_group_entity(process.env.COMPANY)
        data.created_at = new Date
        data.updated_at = new Date
        entity.data$(data).save$(function (err, customer_group) {
          if (err) throw err

          reply({ customer_group: customer_group })
        })
      })
  })

  si.add('role: customer, cmd: edit-group', function (args, done) {
    check(args, done)
      .arg('id').required()
      .arg('name').optional().string().min(2)
      .arg('status').optional().inArray(ENUM_AVAILABLE_STATUSES)
      .then(function (data, reply) {
        var entity = make_customer_group_entity(process.env.COMPANY)
        entity.load$(data.id, function (err, updatedCustomerGroup) {
          if (err) throw err

          if (!updatedCustomerGroup) return done(null, { ok: false, why: 'not-found' })

          data.updated_at = new Date
          updatedCustomerGroup.data$(data).save$(function (err, respond) {
            if (err) throw err

            reply({ customer_group: respond })
          })

        })
      })
  })

  si.add('role: customer, cmd: delete-group', function (args, done) {
    check(args, done)
      .arg('id').required()
      .then(function (data, reply) {
        var entity = make_customer_group_entity(process.env.COMPANY)
        entity.load$(data.id, function (err, deletedCustomerGroup) {
          if (err) throw err

          if (!deletedCustomerGroup) return done(null, { ok: false, why: 'not-found' })

          data.status = STATUS_DELETED
          data.updated_at = new Date
          deletedCustomerGroup.data$(data).save$(function (err, respond) {
            if (err) throw err

            reply({ customer_group: respond })
          })

        })
      })
  })

  si.add('role:customer, cmd:find-group', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_customer_group_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.load$(query, function (err, customer_group) {
          if (err) throw err

          return reply({ customer_group: customer_group })
        })
      })
  })

  si.add('role:customer, cmd:get-group', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_customer_group_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.list$(query, function (err, customer_groups) {
          if (err) throw err

          return reply({ customer_groups: customer_groups })
        })
      })
  })

  si.add('role:customer, cmd:assign', function (args, done) {
    check(args, done)
      .arg('customer_group_id').required()
      .arg('customer_id').required()
      .then(function (data, reply) {
        var entity_customer_group = make_customer_group_entity(process.env.COMPANY)
        entity_customer_group.load$(data.customer_group_id, function (err, respond) {
          if (err) throw err

          if (!respond) return done(null, { ok: false, why: 'not-found' })

          if (respond.status !== STATUS_ACTIVE) return done(null, { ok: false, why: 'invalid-argument' })

          var entity_customer = make_customer_entity(process.env.COMPANY)
          entity_customer.load$(data.customer_id, function (err, respond) {
            if (err) throw err

            if (!respond) return done(null, { ok: false, why: 'not-found' })

            if (respond.status !== STATUS_ACTIVE) return done(null, { ok: false, why: 'invalid-argument' })

            var entity_assign = make_assign_entity(process.env.COMPANY)
            entity_assign.load$(data, function (err, respond) {
              if (err) throw err

              if (respond) return done(null, { ok: false, why: 'assign-is-existing' })

              entity_assign.data$(data).save$(function (err, assign) {
                if (err) throw err

                return reply({ assign: assign })
              })
            })
          })
        })
      })
  })

  si.add('role:customer, cmd:unassign', function (args, done) {
    check(args, done)
      .arg('customer_group_id').required()
      .arg('customer_id').required()
      .then(function (data, reply) {
        var entity = make_assign_entity(process.env.COMPANY)
        entity.load$(data, function (err, respond) {
          if (err) throw err

          if (!respond) return done(null, { ok: false, why: 'assign-not-exist' })

          entity.remove$(data, function (err) {
            if (err) throw err

            return reply({ message: 'deleted' })
          })
        })
      })
  })

  si.add('role: customer, cmd: get-by-group', function (args, done) {
    check(args, done)
      .arg('customer_group_id').required()
      .arg('customer_info').optional().default(true)
      .then(function (data, reply) {
        var entity_customer_group = make_customer_group_entity(process.env.COMPANY)
        entity_customer_group.load$(data.customer_group_id, function (err, respond) {
          if (err) throw err

          if (!respond) return done(null, { ok: false, why: 'not-found' })

          var entity_assign = make_assign_entity(process.env.COMPANY)
          entity_assign.list$({ customer_group_id: data.customer_group_id }, function (err, assigns) {

            if (err) throw err

            var customerIds = assigns.map(function (item) {
              return item.customer_id
            })

            if (data.customer_info === false) {
              return reply({ customerIds: customerIds })
            }

            var entity_customer = make_customer_entity(process.env.COMPANY)

            var nativeQuery = {
              _id: {
                $in: customerIds.map(function (id) {
                  return ObjectID.createFromHexString(id)
                })
              }
            }
            entity_customer.list$({ native$: nativeQuery }, function (err, customers) {
              if (err) throw err

              return reply({ customers: customers })
            })
          })
        })
      })
  })

  si.add('role: customer, cmd: get-by-customer', function (args, done) {
    check(args, done)
      .arg('customer_id').required()
      .arg('customer_group_info').optional().default(true)
      .then(function (data, reply) {
        var entity_customer = make_customer_entity(process.env.COMPANY)
        entity_customer.load$(data.customer_id, function (err, respond) {
          if (err) throw err

          if (!respond) return done(null, { ok: false, why: 'not-found' })

          var entity_assign = make_assign_entity(process.env.COMPANY)
          entity_assign.list$({ customer_id: data.customer_id }, function (err, assigns) {

            if (err) throw err

            var customerGroupIds = assigns.map(function (item) {
              return item.customer_group_id
            })

            if (data.customer_group_info === false) {
              return reply({ customerGroupIds: customerGroupIds })
            }

            var entity_customer_group = make_customer_group_entity(process.env.COMPANY)

            var nativeQuery = {
              _id: {
                $in: customerGroupIds.map(function (id) {
                  return ObjectID.createFromHexString(id)
                })
              }
            }
            entity_customer_group.list$({ native$: nativeQuery }, function (err, customer_groups) {
              if (err) throw err

              return reply({ customer_groups: customer_groups })
            })
          })
        })
      })
  })

  function make_customer_group_entity (company) {
    return si.make(company, 'company', 'customer_group')
  }

  function make_customer_entity (company) {
    return si.make(company, 'company', 'customer')
  }

  function make_assign_entity (company) {
    return si.make(company, 'customer', 'group')
  }

  return 'customer'
}
