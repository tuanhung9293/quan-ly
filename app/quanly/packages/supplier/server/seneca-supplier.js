'use strict'

const check = require('../../argument-validator').check
const Constants = require('../lib/constants')
var Lodash = require('lodash')
var ObjectID = require('mongodb').ObjectID

const STATUS_ACTIVE = Constants.STATUS_ACTIVE
const STATUS_DELETED = Constants.STATUS_DELETED
const ENUM_STATUSES = Constants.ENUM_STATUSES

module.exports = function () {
  var si = this
  si.add('role:supplier, cmd:add', function (args, done) {
    check(args, done)
      .arg('name').required().string().min(2)
      .arg('phone').required().string().min(2)
      .arg('email').required().string().isEmail()
      .arg('address').optional().default('').string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_supplier_entity(process.env.COMPANY)
        data.created_at = new Date
        data.updated_at = new Date
        if (data.status === STATUS_DELETED) {
          data.deleted_at = new Date
        }

        entity.data$(data).save$(function (err, supplier) {
          if (err) throw err

          reply({ supplier: supplier })
        })
      })
  })

  si.add('role:supplier, cmd:update', function (args, done) {
    check(args, done)
      .arg('id').required()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string().min(2)
      .arg('email').optional().isEmail()
      .arg('address').optional().string()
      .arg('status').optional().inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_supplier_entity(process.env.COMPANY)
        entity.load$(data.id, function (err, updatedSupplier) {
          if (err) throw err

          if (!updatedSupplier) return done(null, { ok: false, why: 'not-found' })

          data.updated_at = new Date
          if (data.status === STATUS_DELETED) data.deleted_at = new Date

          updatedSupplier.data$(data).save$(function (err, respond) {
            if (err) throw err
            reply({ supplier: respond })
          })
        })
      })
  })

  si.add('role:supplier, cmd:delete', function (args, done) {
    this.act('role:supplier, cmd:update', { id: args.id, status: STATUS_DELETED }, done)
  })

  si.add('role:supplier, cmd:restore', function (args, done) {
    this.act('role:supplier, cmd:update', { id: args.id, status: STATUS_ACTIVE }, done)
  })

  si.add('role:supplier, cmd:find', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string().min(2)
      .arg('email').optional().isEmail()
      .arg('address').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)

      .then(function (data, reply) {
        var entity = make_supplier_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.load$(query, function (err, supplier) {
          if (err) throw err

          reply({ supplier: supplier })
        })
      })
  })

  si.add('role:supplier, cmd:get', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('phone').optional().string().min(2)
      .arg('email').optional().isEmail()
      .arg('address').optional().string()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)

      .then(function (data, reply) {
        var entity = make_supplier_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.list$(query, function (err, suppliers) {
          if (err) throw err

          reply({ suppliers: suppliers })
        })
      })
  })

  si.add('role:supplier, cmd:add-group', function (args, done) {
    check(args, done)
      .arg('name').required().string().min(2)
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_supplier_group_entity(process.env.COMPANY)
        data.created_at = new Date
        data.updated_at = new Date
        entity.data$(data).save$(function (err, supplier_group) {
          if (err) throw err

          reply({ supplier_group: supplier_group })
        })
      })
  })

  si.add('role: supplier, cmd: update-group', function (args, done) {
    check(args, done)
      .arg('id').required()
      .arg('name').optional().string().min(2)
      .arg('status').optional().inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_supplier_group_entity(process.env.COMPANY)
        entity.load$(data.id, function (err, updatedSupplierGroup) {
          if (err) throw err

          if (!updatedSupplierGroup) return done(null, { ok: false, why: 'not-found' })

          data.updated_at = new Date
          if (data.status === STATUS_DELETED) data.deleted_at = new Date
          updatedSupplierGroup.data$(data).save$(function (err, respond) {
            if (err) throw err

            reply({ supplier_group: respond })
          })

        })
      })
  })

  si.add('role: supplier, cmd: delete-group', function (args, done) {
    this.act('role:supplier, cmd:update-group', { id: args.id, status: STATUS_DELETED }, done)
  })

  si.add('role: supplier, cmd: restore-group', function (args, done) {
    this.act('role:supplier, cmd:update-group', { id: args.id, status: STATUS_ACTIVE }, done)
  })

  si.add('role:supplier, cmd:find-group', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_supplier_group_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.load$(query, function (err, supplier_group) {
          if (err) throw err

          return reply({ supplier_group: supplier_group })
        })
      })
  })

  si.add('role:supplier, cmd:get-group', function (args, done) {
    check(args, done)
      .arg('query').optional().default({}).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = make_supplier_group_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.list$(query, function (err, supplier_groups) {
          if (err) throw err

          return reply({ supplier_groups: supplier_groups })
        })
      })
  })

  si.add('role:supplier, cmd:assign', function (args, done) {
    check(args, done)
      .arg('supplier_group_id').required()
      .arg('supplier_id').required()
      .then(function (data, reply) {
        var entity_supplier_group = make_supplier_group_entity(process.env.COMPANY)
        entity_supplier_group.load$(data.supplier_group_id, function (err, respond) {
          if (err) throw err

          if (!respond) return done(null, { ok: false, why: 'not-found' })

          if (respond.status !== STATUS_ACTIVE) return done(null, { ok: false, why: 'invalid-argument' })

          var entity_supplier = make_supplier_entity(process.env.COMPANY)
          entity_supplier.load$(data.supplier_id, function (err, respond) {
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

  si.add('role:supplier, cmd:unassign', function (args, done) {
    check(args, done)
      .arg('supplier_group_id').required()
      .arg('supplier_id').required()
      .then(function (data, reply) {
        var entity = make_assign_entity(process.env.COMPANY)
        entity.load$(data, function (err, respond) {
          if (err) throw err

          if (!respond) return done(null, { ok: false, why: 'assign-not-exist' })

          entity.remove$(data, function (err) {
            if (err) throw err

            return reply({ supplier_id: data.supplier_id})
          })
        })
      })
  })

  si.add('role: supplier, cmd: get-by-group', function (args, done) {
    check(args, done)
      .arg('supplier_group_id').required()
      .arg('supplier_info').optional().default(true)
      .then(function (data, reply) {
        var entity_supplier_group = make_supplier_group_entity(process.env.COMPANY)
        entity_supplier_group.load$(data.supplier_group_id, function (err, respond) {
          if (err) throw err

          if (!respond) return done(null, { ok: false, why: 'not-found' })

          var entity_assign = make_assign_entity(process.env.COMPANY)
          entity_assign.list$({ supplier_group_id: data.supplier_group_id }, function (err, assigns) {

            if (err) throw err

            var supplierIds = assigns.map(function (item) {
              return item.supplier_id
            })

            if (data.supplier_info === false) {
              return reply({ supplierIds: supplierIds })
            }

            var entity_supplier = make_supplier_entity(process.env.COMPANY)

            var nativeQuery = {
              _id: {
                $in: supplierIds.map(function (id) {
                  return ObjectID.createFromHexString(id)
                })
              }
            }
            entity_supplier.list$({ native$: nativeQuery }, function (err, suppliers) {
              if (err) throw err

              return reply({ suppliers: suppliers })
            })
          })
        })
      })
  })

  si.add('role: supplier, cmd: get-by-supplier', function (args, done) {
    check(args, done)
      .arg('supplier_id').required()
      .arg('supplier_group_info').optional().default(true)
      .then(function (data, reply) {
        var entity_supplier = make_supplier_entity(process.env.COMPANY)
        entity_supplier.load$(data.supplier_id, function (err, respond) {
          if (err) throw err

          if (!respond) return done(null, { ok: false, why: 'not-found' })

          var entity_assign = make_assign_entity(process.env.COMPANY)
          entity_assign.list$({ supplier_id: data.supplier_id }, function (err, assigns) {

            if (err) throw err

            var supplierGroupIds = assigns.map(function (item) {
              return item.supplier_group_id
            })

            if (data.supplier_group_info === false) {
              return reply({ supplierGroupIds: supplierGroupIds })
            }

            var entity_supplier_group = make_supplier_group_entity(process.env.COMPANY)

            var nativeQuery = {
              _id: {
                $in: supplierGroupIds.map(function (id) {
                  return ObjectID.createFromHexString(id)
                })
              }
            }
            entity_supplier_group.list$({ native$: nativeQuery }, function (err, supplier_groups) {
              if (err) throw err

              return reply({ supplier_groups: supplier_groups })
            })
          })
        })
      })
  })

  function make_supplier_group_entity (company) {
    return si.make(company, 'company', 'supplier_group')
  }

  function make_supplier_entity (company) {
    return si.make(company, 'company', 'supplier')
  }

  function make_assign_entity (company) {
    return si.make(company, 'supplier', 'group')
  }

  return 'supplier'
}
