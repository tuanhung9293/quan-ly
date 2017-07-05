'use strict'

const Constants = require('../lib/constants')

module.exports = function () {
  const si = this

  si.add('role:warehouse, cmd:delete, layer:service', function (args, done) {
    var self = this
    this.prior(args, function (err, warehouseRespond) {
      if (err || !warehouseRespond.ok) return done(err, warehouseRespond)

      var logData = {
        user: args.user.id,
        item_type: Constants.LOG_ITEM_TYPE,
        item_id: warehouseRespond.warehouse.id,
        action: Constants.LOG_ACTION_DELETE,
        metadata: { name: warehouseRespond.warehouse.name }
      }
      self.act('role:log, cmd:add, layer:service', logData, function (err, logRespond) {
        if (err || !logRespond.ok) return done(err, logRespond)

        done(null, { ok: true, warehouse: warehouseRespond.warehouse, log: logRespond.log })
      })
    })
  })
  return 'warehouse-service'
}
