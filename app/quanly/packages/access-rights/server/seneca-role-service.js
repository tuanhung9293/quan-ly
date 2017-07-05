'use strict'

const Lodash = require('lodash')
const Constants = require('../lib/constants')
const ObjectID = require('mongodb').ObjectID

module.exports = function () {
  const si = this

  si.add('role:role, cmd:add, layer:service', function (args, done) {
    // never allow to add default role in service layer
    var data = Lodash.assign({}, args, {
      is_default: false,
      is_removable: true
    })
    this.prior(data, done)
  })

  si.add('role:role, cmd:update, layer:service', function (args, done) {
    var self = this
    this.act('role:role, cmd:find', { id: args.id }, function (err, respond) {
      if (err || !respond.ok) {
        return done(err, respond)
      }

      if (respond.role.is_default) {
        return done(null, { ok: false, why: 'access-deny' })
      }

      var data = Lodash.assign({}, args, {
        is_default: false,
        is_removable: true
      })
      self.prior(data, done)
    })
  })

  si.add('role:role, cmd:delete, layer:service', function (args, done) {
    var self = this
    var roleId = args.id
    this.act('role:role, cmd:has-any-administrator-role', { exclude: roleId }, function (err, respond) {
      if (err || !respond.ok) return done(err, respond)

      if (respond.hasAdministratorRole) {
        self.prior(args, function (err, roleRespond) {
          if (err || !roleRespond.ok) return done(err, roleRespond)

          var logData = {
            user: args.user.id,
            item_type: Constants.LOG_ITEM_TYPE_ROLE,
            item_id: roleRespond.role.id,
            action: Constants.LOG_ACTION_DELETE,
            metadata: { name: roleRespond.role.name }
          }
          self.act('role:log, cmd:add, layer:service', logData, function (err, logRespond) {
            if (err || !logRespond.ok) return done(err, logRespond)

            done(null, { ok: true, role: roleRespond.role, log: logRespond.log })
          })
        })
      } else {
        done(null, { ok: false, why: 'no-administrator-role-left' })
      }
    })
  })

  si.add('role:role, cmd:get, layer:service', function (args, done) {
    var defaultQuery = {
      query: {
        native$: [
          { status: Constants.STATUS_ACTIVE },
          { sort: [ [ 'is_default', 'desc' ], [ 'name', 'asc' ] ] }
        ]
      }
    }
    this.prior(Lodash.assign({}, defaultQuery, args), done)
  })

  return 'role-service'
}
