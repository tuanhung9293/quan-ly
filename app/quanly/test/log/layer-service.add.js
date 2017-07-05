'use strict'

const Lab = require('lab')
const Code = require('code')
const Moment = require('moment')
const seneca = require('../seneca')
const Endpoints = require('../../packages/log/lib/constants')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const after = lab.after
const it = lab.it

seneca.add('role:websocket, cmd:broadcast', function (args, done) {
  expect(args.room).to.equal(Endpoints.ROOM_LOG)
  expect(args.eventName).to.equal(Endpoints.EVENT_LOG_CREATED)
  done(null, { room: args.room, eventName: args.eventName, data: args.data })
})

describe('role:log, cmd:add, layer:service', function () {
  after(function (done) {
    seneca.make$('logs').native$(function (err, db) {
      db.collection('logs').drop()
      done()
    })
  })

  it('broadcasts message to room Log when log was created', function (done) {
    const data = {
      user: 'user',
      item_type: 'entity',
      item_id: 'id',
      action: 'add',
      text: 'log-1',
      metadata: { anything: 'you want' },
      created_at: Moment('2015-01-01')
    }
    seneca.act('role:log, cmd:add, layer:service', data, function (err, respond) {
      done()
    })
  })
})