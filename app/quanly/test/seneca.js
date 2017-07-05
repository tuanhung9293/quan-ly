'use strict'

process.env.COMPANY = 'test'

const MONGO_CONFIG = { uri: (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017') + '/test' }

var Seneca = require('seneca')
var seneca = Seneca({ test: true })
seneca.use('entity')
  .use('mongo-store', MONGO_CONFIG)
  .use(require('../packages/mongoose/seneca-mongoose'), MONGO_CONFIG)
  .use(require('../packages/company/server/seneca-company'))
  .use(require('../packages/log/server/seneca-log'))
  .use(require('../packages/log/server/seneca-log-service'))
  .use(require('../packages/access-rights/server/seneca-access-rights'))
  .use(require('../packages/warehouse/server/seneca-warehouse'))
  .use(require('../packages/warehouse/server/seneca-warehouse-service'))
  .use(require('../packages/customer/server/seneca/customer'))
  .use(require('../packages/employee/server/seneca-employee'))
  .use(require('../packages/product/server/seneca/barcode'))
  .use(require('../packages/tag/server/seneca-tag'))
  .use(require('../packages/product/server/seneca/product'))
  .use(require('../packages/product-book/server/seneca/product-book'))
  .use(require('../packages/product-quantity/server/seneca-product-quantity'))
  .use(require('../packages/supplier/server/seneca-supplier'))
  .use(require('../packages/task/server/seneca-task'))
  .use(require('../packages/task/server/seneca-todo-service'))
  .use(require('../packages/tag/server/seneca-tag'))
  .use(require('../packages/retail/server/seneca-retail'))

seneca.add('role:websocket, cmd:broadcast', function (args, done) {
})

module.exports = seneca
