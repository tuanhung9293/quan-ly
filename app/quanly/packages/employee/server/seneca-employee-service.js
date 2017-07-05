'use strict'

const Lodash = require('lodash')
const Constants = require('../lib/constants')

module.exports = function () {
  const si = this

  si.add('role:employee, cmd:delete, layer:service', function (args, done) {
    var self = this
    this.prior(args, function (err, employeeRespond) {
      if (err || !employeeRespond.ok) return done(err, employeeRespond)

      var logData = {
        user: args.user.id,
        item_type: Constants.LOG_ITEM_TYPE,
        item_id: employeeRespond.employee.id,
        action: Constants.LOG_ACTION_DELETE,
        metadata: { name: employeeRespond.employee.name, email: employeeRespond.employee.email }
      }
      self.act('role:log, cmd:add, layer:service', logData, function (err, logRespond) {
        if (err || !logRespond.ok) return done(err, logRespond)

        done(null, { ok: true, employee: employeeRespond.employee, log: logRespond.log })
      })
    })
  })

  si.add('role:employee, cmd:get, layer:service', function(args, done) {
    var defaultQuery = {
      query: {
        native$: [
          { status: { $in: [ Constants.STATUS_ACTIVE, Constants.STATUS_INACTIVE ] } },
          { sort: [ [ 'id', 'asc' ] ] }
        ]
      }
    }
    this.prior(Lodash.assign({}, defaultQuery, args), done)
  })
  return 'employee-service'
}
