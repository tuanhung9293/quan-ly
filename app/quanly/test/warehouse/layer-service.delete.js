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

describe('role:warehouse, cmd:delete, layer:service', function () {
  after(function(done) {
    seneca.make$('company', 'warehouse').native$(function (err, db) {
      db.collection('company_warehouse').drop()
      db.collection('logs').drop()
      done()
    })
  })

  function delete_warehouse (data, callback) {
    data.user = {id: 'fake'}
    seneca.act('role:warehouse, cmd:delete, layer:service', data, callback)
  }

  it('can delete with correct id', function (done) {
    seneca.act('role:warehouse, cmd:add', { name: 'name' }, function (err, createdWarehouse) {
      var id = createdWarehouse.warehouse.id
      delete_warehouse({ id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.warehouse.status).to.equal('deleted')
        expect(respond.log).to.exist()
        done()
      })
    })
  })

  it('can NOT update warehouse with wrong id', function (done) {
    seneca.act('role:warehouse, cmd:add', { name: 'name' }, function (err, createdWarehouse) {
      var idNotFoundData = {
        id: 'wrong-id'
      }
      delete_warehouse(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })
})
