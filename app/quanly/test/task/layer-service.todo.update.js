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

describe('role:todo, cmd:update, layer:service', function () {
  after(function (done) {
    seneca.make$('tasks').native$(function (err, db) {
      var collection = db.collection('tasks');
      collection.drop()
      done()
    })
  })

  function add_task_todo (data, callback) {
    seneca.act('role:todo, cmd:add, layer:service', data, callback)
  }

  function update_task_todo (data, callback) {
    seneca.act('role:todo, cmd:update, layer:service', data, callback)
  }

  var testData = {
    text: 'Todo',
    status: 'todo',
    trading_type: 'Todo',
    trading_id: 'Todo_1',
    description: 'To do'
  }

  it('can update task todo with perfect data but status not change', function (done) {
    add_task_todo(testData, function (err, respond) {
      var perfectData = {
        id: respond.task.id,
        text: 'in-progress',
        status: 'in-progress',
        trading_type: 'in-progress',
        trading_id: 'in-progress_1',
        description: 'In progress'
      }
      update_task_todo(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.task.id).to.be.exist()
        expect(respond.task.text).to.equal(perfectData.text)
        expect(respond.task.status).to.equal(testData.status)
        expect(respond.task.trading_type).to.equal(perfectData.trading_type)
        expect(respond.task.trading_id).to.equal(perfectData.trading_id)
        expect(respond.task.description).to.equal(perfectData.description)
        expect(respond.task.updated_at).to.be.exist()
        done()
      })
    })
  })
})