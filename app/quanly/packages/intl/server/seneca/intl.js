'use strict'

const Lodash = require('lodash')
const check = require('../../../argument-validator').check
const Constants = require('../../lib/constants')

module.exports = function (options) {
  const si = this
  const DEFAULT_LOCALE = options.defaultLocale
  const supportedLocales = options.supportedLocales

  si.add('role:intl, cmd:set', function (args, done) {
    check(args, done)
      .arg('message_id').required().string(true)
      .arg('default_message').required().string(true)
      .arg('custom_message').optional().string()
      .arg('locale').optional().default(DEFAULT_LOCALE)
      .arg('status').optional().default(Constants.STATUS_TRANSLATED).inArray(Constants.ENUM_STATUSES)
      .then(function (data, reply) {
        // console.log(data)
        reply(true)
      })
  })

  si.add('role:intl, cmd:get-locales', function (args, done) {

  })

  si.add('role:intl, cmd:get', function (args, done) {
    check(args, done)
      .arg('locale').optional().default(DEFAULT_LOCALE)
      .then(function (data, reply) {

      })
  })

  return 'intl'
}
