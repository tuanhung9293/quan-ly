'use strict'

var Seneca = require('seneca')
var Config = require('./config')

var seneca = Seneca(Config.seneca)

seneca.use('entity')

if (process.env.CONTAINER_RUN !== 'build-messages') {
  seneca.use('mongo-store', Config.mongodb)
  seneca.use(require('../packages/mongoose/seneca-mongoose'), Config.mongodb)
}

seneca
  .use(require('../packages/intl/server/seneca/intl'))
  .use(require('../packages/log/server/seneca-log'))
  .use(require('../packages/log/server/seneca-log-service'))
  .use(require('../packages/access-rights/server/seneca-access-rights'))
  .use(require('../packages/employee/server/seneca-employee'))
  .use(require('../packages/employee/server/seneca-employee-service'))
  .use(require('../packages/warehouse/server/seneca-warehouse'))
  .use(require('../packages/warehouse/server/seneca-warehouse-service'))
  .use(require('../packages/demo-account/server/seneca-demo-account'))
  .use(require('../packages/supplier/server/seneca-supplier'))
  .use(require('../packages/supplier/server/seneca-supplier-service'))
module.exports = seneca
