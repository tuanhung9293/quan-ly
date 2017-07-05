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

describe('role:retail, cmd:update', function () {
  after(function (done) {
    seneca.make$('company', 'retail').native$(function (err, db) {
      var collection = db.collection('company_retail');
      collection.drop()
      done()
    })
  })

  function update_retail (data, callback) {
    seneca.act('role:retail, cmd:update', data, callback)
  }

  it('can update perfect data', function (done) {
    seneca.act('role:retail, cmd:add', { name: 'name' }, function (err, createdretail) {
      var perfectData = {
        id: createdretail.retail.id,
        name: 'perfect-name',
        phone: '0911222333',
        email: 'perfect@gmail.com',
        address: '123 Pen.',
        status: 'inactive'
      }
      update_retail(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.retail).to.include(perfectData)
        expect(respond.retail.created_at).to.be.exist()
        expect(respond.retail.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update do not touch not provided properties', function (done) {
    seneca.act('role:retail, cmd:add', { name: 'name', address: 'abc' }, function (err, createdretail) {
      var perfectData = {
        id: createdretail.retail.id,
      }
      update_retail(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.retail.name).to.equal('name')
        expect(respond.retail.address).to.equal('abc')
        expect(respond.retail.created_at).to.be.exist()
        expect(respond.retail.updated_at).to.be.exist()
        done()
      })
    })
  })

  // --------------------------------------------------

  it('can NOT update retail without id', function (done) {
    seneca.act('role:retail, cmd:add', { name: 'name' }, function (err, createdretail) {
      var idNotFoundData = {
        name: 'name',
      }
      update_retail(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update retail with wrong id', function (done) {
    seneca.act('role:retail, cmd:add', { name: 'name' }, function (err, createdretail) {
      var idNotFoundData = {
        id: 'wrong-id',
        name: 'name',
      }
      update_retail(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

  it('can NOT update with too short name', function (done) {
    seneca.act('role:retail, cmd:add', { name: 'name' }, function (err, createdretail) {
      var perfectData = {
        id: createdretail.retail.id,
        name: '1'
      }
      update_retail(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update with wrong email', function (done) {
    seneca.act('role:retail, cmd:add', { name: 'name' }, function (err, createdretail) {
      var perfectData = {
        id: createdretail.retail.id,
        email: 'wrong@',
      }
      update_retail(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })
})