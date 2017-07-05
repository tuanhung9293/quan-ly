'use strict'

module.exports = function (options) {
  var seneca = this
  seneca.use(require('./seneca-role'))
  seneca.use(require('./seneca-role-service'))

  return 'access-rights'
}