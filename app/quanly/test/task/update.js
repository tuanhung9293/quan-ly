'use strict'

process.env.COMPANY = 'default'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:task, cmd:update', function () {
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

  function update_task (data, callback) {
    seneca.act('role:task, cmd:update', data, callback)
  }

  var testData = {
    type: 'Todo',
    text: 'Todo',
    status: 'Todo',
    trading_type: 'Todo',
    trading_id: 'Todo_1',
    description: 'To do'
  }

  it('can update task with perfect data', function (done) {
    add_task(testData, function (err, respond) {
      var perfectData = {
        id: respond.task.id,
        type: 'in-progress',
        text: 'in-progress',
        status: 'in-progress',
        trading_type: 'in-progress',
        trading_id: 'in-progress_1',
        description: 'In progress'
      }
      update_task(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.task.id).to.be.exist()
        expect(respond.task).to.include(perfectData)
        expect(respond.task.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update task with missing optinal data', function (done) {
    add_task(testData, function (err, respond) {
      var missingData = {
        id: respond.task.id,
        type: 'in-progress'
      }
      update_task(missingData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.task.id).to.be.exist()
        expect(respond.task.type).to.equal(missingData.type)
        expect(respond.task.updated_at).to.be.exist()
        done()
      })
    })
  })

  //-------------------------------------------------------------------------------------------------

  it('can NOT update task without id', function (done) {
    add_task(testData, function (err, respond) {
      var undefinedIdData = {
        type: 'in-progress',
        text: 'in-progress',
        status: 'in-progress',
        trading_type: 'in-progress',
        trading_id: 'in-progress_1',
        description: 'In progress'
      }
      update_task(undefinedIdData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update task with wrong id', function (done) {
    add_task(testData, function (err, respond) {
      var wrongIdData = {
        id: '111111111111a',
        type: 'in-progress',
        text: 'in-progress',
        status: 'in-progress',
        trading_type: 'in-progress',
        trading_id: 'in-progress_1',
        description: 'In progress'
      }
      update_task(wrongIdData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })
})