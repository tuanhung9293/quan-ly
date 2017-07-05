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

describe('role:warehouse, cmd:update', function () {
  after(function(done) {
    seneca.make$('company', 'warehouse').native$(function (err, db) {
      var collection = db.collection('company_warehouse');
      collection.drop()
      done()
    })
  })

  function update_warehouse (data, callback) {
    seneca.act('role:warehouse, cmd:update', data, callback)
  }

  it('can update perfect data', function (done) {
    seneca.act('role:warehouse, cmd:add', { name: 'name' }, function (err, createdWarehouse) {
      var perfectData = {
        id: createdWarehouse.warehouse.id,
        name: 'perfect-name',
        phone: '0911222333',
        email: 'perfect@gmail.com',
        address: '123 Pen.',
        status: 'inactive'
      }
      update_warehouse(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.warehouse).to.include(perfectData)
        expect(respond.warehouse.created_at).to.be.exist()
        expect(respond.warehouse.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update do not touch not provided properties', function (done) {
    seneca.act('role:warehouse, cmd:add', { name: 'name', address: 'abc' }, function (err, createdWarehouse) {
      var perfectData = {
        id: createdWarehouse.warehouse.id,
      }
      update_warehouse(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.warehouse.name).to.equal('name')
        expect(respond.warehouse.address).to.equal('abc')
        expect(respond.warehouse.created_at).to.be.exist()
        expect(respond.warehouse.updated_at).to.be.exist()
        done()
      })
    })
  })

  // --------------------------------------------------

  it('can NOT update warehouse without id', function (done) {
    seneca.act('role:warehouse, cmd:add', { name: 'name' }, function (err, createdWarehouse) {
      var idNotFoundData = {
        name: 'name',
      }
      update_warehouse(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update warehouse with wrong id', function (done) {
    seneca.act('role:warehouse, cmd:add', { name: 'name' }, function (err, createdWarehouse) {
      var idNotFoundData = {
        id: 'wrong-id',
        name: 'name',
      }
      update_warehouse(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

  it('can NOT update with too short name', function (done) {
    seneca.act('role:warehouse, cmd:add', { name: 'name' }, function (err, createdWarehouse) {
      var perfectData = {
        id: createdWarehouse.warehouse.id,
        name: '1'
      }
      update_warehouse(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update with wrong email', function (done) {
    seneca.act('role:warehouse, cmd:add', { name: 'name' }, function (err, createdWarehouse) {
      var perfectData = {
        id: createdWarehouse.warehouse.id,
        email: 'wrong@',
      }
      update_warehouse(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })
})