'use strict'

const Moment = require('moment')
const Endpoints = require('../lib/constants')

module.exports = function () {
  var si = this

  si.add('role:log, func:build-query', function (args, done) {
    var nativeMetaQuery = {
      sort: [ [ 'created_at', 'desc' ] ]
    }
    if (typeof args.limit !== 'undefined') {
      nativeMetaQuery.limit = args.limit
    }
    if (typeof args.skip !== 'undefined') {
      nativeMetaQuery.skip = args.skip
    }

    var nativeQuery = {
      user: args.user.id
    }

    var nextOffsetDate = undefined
    var startDate = (typeof args.start !== 'undefined') ? Moment(args.start) : null
    var endDate = (typeof args.end !== 'undefined') ? Moment(args.end) : null

    if (typeof args.date !== 'undefined') {
      startDate = Moment(args.date)
      endDate = Moment(startDate).add(1, 'day')
    }

    if (typeof args.offset !== 'undefined') {
      endDate = (typeof args.offsetDate !== 'undefined') ? Moment(args.offsetDate) : Moment()
      var offset = (args.offset || '-6 days').split(' ')
      var duration = parseInt(offset[ 0 ])
      if (isNaN(duration)) {
        duration = -6
      }
      startDate = Moment(endDate).add(duration, offset[ 1 ])
      nextOffsetDate = startDate.toDate()
    }

    if (startDate === null) {
      startDate = Moment(0, 'HH')
    }
    if (endDate === null) {
      endDate = Moment(0, 'HH').add(1, 'day')
    }
    nativeQuery.created_at = {
      $gte: startDate.toDate(),
      $lte: endDate.toDate()
    }

    var respond = {
      ok: true,
      query: { native$: [ nativeQuery, nativeMetaQuery ] },
      offset_date: nextOffsetDate
    }
    done(null, respond)
  })

  si.add('role:log, cmd:add, layer:service', function (args, done) {
    var self = this
    this.prior(args, function (err, respond) {
      if (err || !respond.ok) return done(err, respond)

      self.act('role:websocket, cmd:broadcast', {
        room: Endpoints.ROOM_LOG,
        eventName: Endpoints.EVENT_LOG_CREATED,
        data: respond.log
      })
      done(null, respond)
    })
  })

  si.add('role:log, cmd:get, layer:service', function (args, done) {
    var buildQueryArgs = {
      user: args.user,
      date: args.date,
      start: args.start,
      end: args.end,
      offset: args.offset,
      offsetDate: args.offsetDate
    }
    var self = this
    this.act('role:log, func:build-query', buildQueryArgs, function (err, queryRespond) {
      if (err) return done(err)

      if (!queryRespond.ok) {
        return self.prior({ user: args.user.id }, done)
      }
      self.prior({ query: queryRespond.query }, function (err, respond) {
        if (err) return done(err)

        done(null, { logs: respond.logs, offset_date: queryRespond.offset_date })
      })
    })
  })

  return 'log-service'
}
