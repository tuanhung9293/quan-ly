'use strict'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:task, cmd:add', function () {
  after(function (done) {
    seneca.make$('tasks').native$(function (err, db) {
      var collection = db.collection('tasks');
      collection.drop()
      done()
    })
  })

  function add_task (data, callback) {
    seneca.act('role:task, cmd:add', data, callback)
  }

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.task.created_at).to.be.exist()
    expect(respond.task.updated_at).to.be.exist()
  }

  it('can add with perfect data', function (done) {
    var perfectData = {
      type: 'Todo',
      text: 'Todo',
      status: 'Todo',
      trading_type: 'Todo',
      trading_id: 'Todo_1',
      description: 'To do'
    }

    add_task(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.task.id).to.be.exist()
      expect(respond.task).to.include(perfectData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  it('can add with missing optional data', function (done) {
    var missionOptionalData = {
      type: 'in-progress',
      text: 'in-progress',
      status: 'in-progress'
    }

    add_task(missionOptionalData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.task.id).to.be.exist()
      expect(respond.task).to.include(missionOptionalData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  // --------------------------------------------------
  var invalidCallback = function (done) {
    return function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    }
  }

  it("can NOT add with missing required data", function (done) {
    var missingData = {
      trading_type: 'Todo',
      trading_id: 'Todo_1',
      description: 'To do'
    }
    add_task(missingData, invalidCallback(done))
  })

  it("can NOT add with too short type", function (done) {
    var shortTypeData = {
      type: 'T',
      text: 'Todo',
      status: 'Todo',
      trading_type: 'Todo',
      trading_id: 'Todo_1',
      description: 'To do'
    }
    add_task(shortTypeData, invalidCallback(done))
  })

  it("can NOT add with too short text", function (done) {
    var shortTextData = {
      type: 'Todo',
      text: 'T',
      status: 'Todo',
      trading_type: 'Todo',
      trading_id: 'Todo_1',
      description: 'To do'
    }
    add_task(shortTextData, invalidCallback(done))
  })

  it("can NOT add with too short status", function (done) {
    var shortStatusData = {
      type: 'Todo',
      text: 'Todo',
      status: 'T',
      trading_type: 'Todo',
      trading_id: 'Todo_1',
      description: 'To do'
    }
    add_task(shortStatusData, invalidCallback(done))
  })

})