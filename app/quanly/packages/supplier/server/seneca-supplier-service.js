'use strict'

const Constants = require('../lib/constants')

module.exports = function () {
  const si = this

  si.add('role:supplier, cmd:delete, layer:service', function (args, done) {
    var self = this
    this.prior(args, function (err, supplierRespond) {
      if (err || !supplierRespond.ok) return done(err, supplierRespond)

      var logData = {
        user: args.user.id,
        item_type: Constants.LOG_ITEM_TYPE,
        item_id: supplierRespond.supplier.id,
        action: Constants.LOG_ACTION_DELETE,
        metadata: { name: supplierRespond.supplier.name }
      }
      self.act('role:log, cmd:add, layer:service', logData, function (err, logRespond) {
        if (err || !logRespond.ok) return done(err, logRespond)

        done(null, { ok: true, supplier: supplierRespond.supplier, log: logRespond.log })
      })
    })
  })

  si.add('role:supplier, cmd:add, layer:service', function (args, done) {
    if (typeof args.supplier_group_id !== 'undefined' && args.supplier_group_id !== 'all') {
      var self = this
      return this.prior(args, function (err, respond) {
        if (err || !respond.ok) return done(err, respond)

        var assignArgs = {
          supplier_id: respond.supplier.id,
          supplier_group_id: args.supplier_group_id
        }
        self.act('role:supplier, cmd:assign', assignArgs, function (err, assignRespond) {
          done(null, respond)
        })
      })
    }

    this.prior(args, done)
  })

  si.add('role:supplier, cmd:get, layer:service', function (args, done) {
    if (typeof args.supplier_group_id !== 'undefined' && args.supplier_group_id !== 'all') {
      var self = this
      return this.prior(args, function (err, respond) {
        if (err || !respond.ok) return done(err, respond)

        var assignArgs = {
          supplier_group_id: args.supplier_group_id
        }
        self.act('role:supplier, cmd:get-by-group', assignArgs, function (err, assignRespond) {
          done(null, assignRespond)
        })
      })
    }

    this.prior(args, done)
  })

  return 'supplier-service'
}