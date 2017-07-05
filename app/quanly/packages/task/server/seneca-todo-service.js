'use strict'

const Constants = require('../lib/constants')

const STATUS_TODO = Constants.STATUS_TODO
const STATUS_DONE = Constants.STATUS_DONE

module.exports = function () {
  const si = this

  si.add('role:todo, cmd:add, layer:service', function (args, done) {
    args.type = 'todo'
    args.status = STATUS_TODO
    this.act('role:task, cmd:add', args, function (err, respond) {
      if (err || !respond.ok) return done(null, respond)

      return done(null, respond)
    })
  })

  si.add('role:todo, cmd:update, layer:service', function (args, done) {
    var updateArgs = {
      id: args.id,
      text: args.text,
      trading_type: args.trading_type,
      trading_id: args.trading_id,
      description: args.description
    }
    this.act('role:task, cmd:update', updateArgs, function (err, respond) {
      if (err || !respond.ok) return done(null, respond)

      return done(null, respond)
    })
  })

  si.add('role:todo, cmd:completed, layer:service', function (args, done) {
    var updateArgs = {
      id: args.id,
      status: STATUS_DONE
    }
    this.act('role:task, cmd:update', updateArgs, function (err, respond) {
      if (err || !respond.ok) return done(null, respond)

      return done(null, respond)
    })
  })
}
