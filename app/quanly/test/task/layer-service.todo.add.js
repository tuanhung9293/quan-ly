'use strict'

process.env.COMPANY = 'test'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:todo, cmd:add, layer:service', function () {
  after(function (done) {
    seneca.make$('tasks').native$(function (err, db) {
      var collection = db.collection('tasks');
      collection.drop()
      done()
    })
  })

  function add_task_todo (data, callback) {
    seneca.act('role:todo, cmd:add, layer:service, type:todo', data, callback)
  }

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.task.created_at).to.be.exist()
    expect(respond.task.updated_at).to.be.exist()
  }

  it('can add with perfect data', function (done) {
    var perfectData = {
      text: 'Todo',
      status: 'todo',
      trading_type: 'Todo',
      trading_id: 'Todo_1',
      description: 'To do'
    }

    add_task_todo(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.task.id).to.be.exist()
      expect(respond.task).to.include(perfectData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  it('can add with missing status data', function (done) {
    var missingStatusData = {
      text: 'Todo',
      trading_type: 'Todo',
      trading_id: 'Todo_1',
      description: 'To do'
    }

    add_task_todo(missingStatusData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.task.id).to.be.exist()
      expect(respond.task).to.include(missingStatusData)
      expect(respond.task.status).to.equal('todo')
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })
})
