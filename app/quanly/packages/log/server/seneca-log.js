'use strict'

const Lodash = require('lodash')
const Moment = require('moment')
const check = require('../../argument-validator').check

module.exports = function () {
  var si = this

  si.add('role:log, cmd:add', function (args, done) {
    check(args, done)
      .arg('user').required()
      .arg('item_type').required().string(true)
      .arg('item_id').required()
      .arg('action').required().string(true)
      .arg('text').optional().string()
      .arg('metadata').optional()
      .arg('created_at').optional()
      .then(function (data, reply) {
        var entity = make_log_entity(process.env.COMPANY)

        var now = Moment(data.created_at) || Moment()
        data.created_at = now.toDate()
        entity.data$(data).save$(function (err, log) {
          if (err) throw err

          reply({ log: log })
        })
      })
  })

  si.add('role:log, cmd:get', function (args, done) {
    check(args, done)
      .arg('user').optional()
      .arg('item_type').optional()
      .arg('item_id').optional()
      .arg('action').optional()
      .arg('metadata').optional()
      .arg('query').optional().default({ sort$: { created_at: -1 } }).object()
      .then(function (data, reply) {
        var entity = make_log_entity(process.env.COMPANY)

        var query = Lodash.assign({}, data.query, data)
        delete query.query

        entity.list$(query, function (err, logs) {
          if (err) throw err

          reply({ logs })
        })
      })
  })

  /**
   * Log entity:
   *  - user       (required) user's id
   *  - entity     (required) entity canon without zone, i.e company/warehouse
   *  - type       (required) log type
   *  - year       (auto)
   *  - month      (auto)
   *  - date       (auto)
   *  - hour       (auto)
   *  - created_at (auto)
   */
  function make_log_entity (company) {
    return si.make$(company, undefined, 'logs')
  }

  return 'log'
}
