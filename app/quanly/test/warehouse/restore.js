'use strict'

process.env.COMPANY = 'test'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:warehouse, cmd:restore', function () {
  after(function(done) {
    seneca.make$('company', 'warehouse').native$(function (err, db) {
      var collection = db.collection('company_warehouse');
      collection.drop()
      done()
    })
  })

  function restore_warehouse (data, callback) {
    seneca.act('role:warehouse, cmd:restore', data, callback)
  }

  it('can restore with correct id', function (done) {
    seneca.act('role:warehouse, cmd:add', { name: 'name' }, function (err, createdWarehouse) {
      var id = createdWarehouse.warehouse.id
      restore_warehouse({ id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.warehouse.status).to.equal('active')
        done()
      })
    })
  })

  it('can NOT restore warehouse without id', function (done) {
    seneca.act('role:warehouse, cmd:add', { name: 'name' }, function (err, createdWarehouse) {
      restore_warehouse({}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT restore warehouse with wrong id', function (done) {
    seneca.act('role:warehouse, cmd:add', { name: 'name' }, function (err, createdWarehouse) {
      var idNotFoundData = {
        id: 'wrong-id'
      }
      restore_warehouse(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

})