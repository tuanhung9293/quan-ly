'use strict'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const Async = require('async')
const Moment = require('moment')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const after = lab.after
const it = lab.it

describe('role:log', function () {
  after(function (done) {
    seneca.make$('logs').native$(function (err, db) {
      db.collection('logs').drop()
      done()
    })
  })

  function add_log (data, callback) {
    seneca.act('role:log, cmd:add', data, callback)
  }

  function expect_invalid_argument (err, respond, arg) {
    expect(err).to.not.exist()
    expect(respond.ok).to.be.false()
    expect(respond.why).to.equal('invalid-argument')
    expect(respond.errors[ arg ]).to.exist()
  }

  it('can NOT add log without user', function (done) {
    const withoutUserLog = {
      item_type: 'entity',
      item_id: 'id',
      action: 'add',
      text: 'text'
    }
    add_log(withoutUserLog, function (err, respond) {
      expect_invalid_argument(err, respond, 'user')
      done()
    })
  })

  it('can NOT add log without item_type', function (done) {
    const withoutUserLog = {
      user: 'user',
      item_id: 'id',
      action: 'add',
      text: 'text'
    }
    add_log(withoutUserLog, function (err, respond) {
      expect_invalid_argument(err, respond, 'item_type')
      done()
    })
  })

  it('can NOT add log without item_id', function (done) {
    const withoutUserLog = {
      user: 'user',
      item_type: 'entity',
      action: 'add',
      text: 'text'
    }
    add_log(withoutUserLog, function (err, respond) {
      expect_invalid_argument(err, respond, 'item_id')
      done()
    })
  })

  it('can NOT add log without action', function (done) {
    const withoutUserLog = {
      user: 'user',
      item_type: 'entity',
      item_id: 'id',
      text: 'text'
    }
    add_log(withoutUserLog, function (err, respond) {
      expect_invalid_argument(err, respond, 'action')
      done()
    })
  })

  it('can use for adding a log with created_at', function (done) {
    var data = {
      user: 'user',
      item_type: 'entity',
      item_id: 'id',
      action: 'add',
      text: 'log-1',
      metadata: { anything: 'you want' },
    }
    add_log(Lodash.assign({}, data, { created_at: '2015-05-16 12:13:14' }), function (err, respond) {
      expect(err).to.not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.log).to.exist()
      expect(respond.log).include(data)
      expect(respond.log.created_at).to.exist()
      done()
    })
  })

  it('can use for adding a log with current time', function (done) {
    var data = {
      user: 'user',
      item_type: 'entity',
      item_id: 'id',
      action: 'add',
      text: 'log-2',
      metadata: { iMeant: { anything: true } },
    }
    add_log(data, function (err, respond) {
      expect(err).to.not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.log).to.exist()
      expect(respond.log).include(data)
      expect(respond.log.created_at).to.exist()
      done()
    })
  })

  it('can get the logs order by created_at DESC by default', function (done) {
    seneca.act('role:log, cmd:get', { user: 'user' }, function (err, respond) {
      expect(err).to.not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.logs[ 0 ].text).to.equal('log-2')
      expect(respond.logs[ 1 ].text).to.equal('log-1')
      done()
    })
  })

  it('can get the logs based on single field such as user', function (done) {
    var args = {
      text: 'log-2'
    }
    seneca.act('role:log, cmd:get', args, function (err, respond) {
      expect(err).to.not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.logs[ 0 ].text).to.equal('log-2')
      done()
    })
  })

  it('can get the logs based on single field such as action', function (done) {
    var args = {
      action: 'add'
    }
    seneca.act('role:log, cmd:get', args, function (err, respond) {
      expect(err).to.not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.logs.length).to.equal(2)
      expect(respond.logs[ 0 ].action).to.equal('add')
      done()
    })
  })
})