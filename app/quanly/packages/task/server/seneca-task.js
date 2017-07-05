'use strict'

const Lodash = require('lodash')
const check = require('../../argument-validator').check

module.exports = function () {
  var si = this

  si.add('role:task, cmd:add', function (args, done) {
    check(args, done)
      .arg('type').required().string().min(2)
      .arg('text').required().string().min(2)
      .arg('status').required().string().min(2)
      .arg('trading_type').optional().string()
      .arg('trading_id').optional().string()
      .arg('description').optional().string()
      .then(function (data, reply) {
        var entity = make_task_entity(process.env.COMPANY)

        data.created_at = new Date
        data.updated_at = new Date
        entity.data$(data).save$(function (err, task) {
          if (err) throw err
          reply({ task: task })
        })
      })
  })

  si.add('role:task, cmd:update', function (args, done) {
    check(args, done)
      .arg('id').required()
      .arg('type').optional().string()
      .arg('text').optional().string()
      .arg('status').optional().string()
      .arg('trading_type').optional().string()
      .arg('trading_id').optional().string()
      .arg('description').optional().string()
      .then(function (data, reply) {
        var entity = make_task_entity(process.env.COMPANY)

        entity.load$(data.id, function (err, updatedTask) {
          if (err) throw err

          if (!updatedTask) return done(null, { ok: false, why: 'not-found' })

          data.updated_at = new Date
          updatedTask.data$(data).save$(function (err, respond) {
            if (err) throw err

            reply({ task: respond })
          })
        })
      })
  })

  si.add('role:task, cmd:find', function (args, done) {
    check(args, done)
      .arg('query').optional().default({ sort$: { id: 1 } }).object()
      .arg('id').optional()
      .arg('type').optional().string()
      .arg('text').optional().string()
      .arg('status').optional().string()
      .arg('trading_type').optional().string()
      .arg('trading_id').optional().string()
      .arg('description').optional().string()
      .then(function (data, reply) {
        var entity = make_task_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.load$(query, function (err, task) {
          if (err) throw err

          reply({ task: task })
        })
      })
  })

  si.add('role:task, cmd:get', function (args, done) {
    check(args, done)
      .arg('query').optional().default({ sort$: { id: 1 } }).object()
      .arg('id').optional()
      .arg('type').optional().string()
      .arg('text').optional().string()
      .arg('status').optional().string()
      .arg('trading_type').optional().string()
      .arg('trading_id').optional().string()
      .arg('description').optional().string()
      .then(function (data, reply) {
        var entity = make_task_entity(process.env.COMPANY)
        var query = Lodash.assign({}, data.query, data)
        delete query.query
        entity.list$(query, function (err, tasks) {
          if (err) throw err

          reply({ tasks: tasks })
        })
      })
  })

  function make_task_entity (company) {
    return si.make(company, undefined, 'tasks')
  }

  return 'task'
}
