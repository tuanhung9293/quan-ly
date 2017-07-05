'use strict'

const Lodash = require('lodash')
const check = require('../../argument-validator').check
const Constants = require('../lib/constants')
const ObjectID = require('mongodb').ObjectID

const STATUS_ACTIVE = Constants.STATUS_ACTIVE
const STATUS_DELETED = Constants.STATUS_DELETED
const ENUM_STATUSES = Constants.ENUM_STATUSES

module.exports = function () {
  const si = this
  const RoleModel = require('./model/Role')(
    si.mongoose, make_role_entity(process.env.COMPANY)
  )
  const EmployeeModel = require('./model/Employee')(
    si.mongoose, make_employee_entity(process.env.COMPANY)
  )
  const EmployeeRoleModel = require('./model/EmployeeRole')(
    si.mongoose, make_employee_role_entity(process.env.COMPANY)
  )

  function make_role_entity (company) {
    return si.make(company, 'access_rights', 'roles')
  }

  function make_employee_entity (company) {
    return si.make(company, 'company', 'employees')
  }
  
  function make_employee_role_entity (company) {
    return si.make(company, 'access_rights', 'employee_roles')
  }

  si.add('role:role, cmd:add', function (args, done) {
    check(args, done)
      .arg('name').required().string().min(2)
      .arg('alias').optional().string()
      .arg('is_admin').optional().boolean().default(false)
      .arg('is_default').optional().boolean().default(false)
      .arg('is_removable').optional().boolean().default(true)
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        if (data.is_default === true) {
          data.is_removable = false
        }

        data.created_at = new Date
        data.updated_at = new Date
        RoleModel.create(data, function (err, role) {
          if (err) throw err

          reply({ role: role.toEntity() })
        })
      })
  })

  si.add('role:role, cmd:update', function (args, done) {
    check(args, done)
      .arg('id').required()
      .arg('name').optional().string().min(2)
      .arg('alias').optional().string()
      .arg('is_admin').optional().boolean()
      .arg('is_default').optional().boolean()
      .arg('is_removable').optional().boolean()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        RoleModel.findById(data.id, function (err, updatedRole) {
          if (err || !updatedRole) return done(null, { ok: false, why: 'not-found' })

          data.updated_at = new Date
          updatedRole.data$(data)

          if (updatedRole.is_default === true) {
            updatedRole.is_removable = false
          }

          if (updatedRole.is_removable === false && updatedRole.status === STATUS_DELETED) {
            updatedRole.status = STATUS_ACTIVE
          }

          if (updatedRole.status === STATUS_DELETED) {
            updatedRole.deleted_at = new Date
          }

          updatedRole.save(function (err, respond) {
            if (err) throw err

            reply({ role: respond.toEntity() })
          })
        })
      })
  })

  si.add('role:role, cmd:delete', function (args, done) {
    this.act('role:role, cmd:update', { id: args.id, status: STATUS_DELETED }, done)
  })

  si.add('role:role, cmd:restore', function (args, done) {
    this.act('role:role, cmd:update', { id: args.id, status: STATUS_ACTIVE }, done)
  })

  si.add('role:role, cmd:find', function (args, done) {
    check(args, done)
      .arg('query').optional().default({ sort$: { id: 1 } }).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('alias').optional().string()
      .arg('is_admin').optional().boolean()
      .arg('is_default').optional().boolean()
      .arg('is_removable').optional().boolean()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = RoleModel.getEntity()
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.load$(query, function (err, role) {
          if (err) throw err

          reply({ role: role })
        })
      })
  })

  si.add('role:role, cmd:get', function (args, done) {
    check(args, done)
      .arg('query').optional().default({ sort$: { id: 1 } }).object()
      .arg('id').optional()
      .arg('name').optional().string().min(2)
      .arg('alias').optional().string()
      .arg('is_admin').optional().boolean()
      .arg('is_default').optional().boolean()
      .arg('is_removable').optional().boolean()
      .arg('status').optional().default(STATUS_ACTIVE).inArray(ENUM_STATUSES)
      .then(function (data, reply) {
        var entity = RoleModel.getEntity()
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.list$(query, function (err, roles) {
          if (err) throw err

          reply({ roles: roles })
        })
      })
  })

  // TODO: write unit test
  si.add('role:role, cmd:has-any-administrator-role', function (args, done) {
    var query = {
      status: Constants.STATUS_ACTIVE,
      is_admin: true,
      is_default: false
    }

    if (args.exclude) {
      query._id = { $ne: ObjectID.createFromHexString(args.exclude) }
    }

    var nativeQuery = { query: { native$: query } }
    this.act('role:role, cmd:find', nativeQuery, function (err, respond) {
      if (err || !respond.ok) return done(err, respond)

      if (respond.role) {
        return done(null, { ok: true, hasAdministratorRole: true })
      }
      return done(null, { ok: true, hasAdministratorRole: false })
    })
  })

  return 'access-rights-role'
}
