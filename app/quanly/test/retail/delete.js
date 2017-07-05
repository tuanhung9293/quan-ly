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

describe('role:retail, cmd:delete', function () {
  after(function (done) {
    seneca.make$('company', 'retail').native$(function (err, db) {
      var collection = db.collection('company_retail');
      collection.drop()
      done()
    })
  })

  function delete_retail (data, callback) {
    seneca.act('role:retail, cmd:delete', data, callback)
  }

  it('can delete with correct id', function (done) {
    seneca.act('role:retail, cmd:add', { name: 'name' }, function (err, createdRetail) {
      var id = createdRetail.retail.id
      delete_retail({ id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.retail.status).to.equal('deleted')
        done()
      })
    })
  })

  it('can NOT delete retail without id', function (done) {
    seneca.act('role:retail, cmd:add', { name: 'name' }, function (err, createdRetail) {
      delete_retail({}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update retail with wrong id', function (done) {
    seneca.act('role:retail, cmd:add', { name: 'name' }, function (err, createdRetail) {
      var idNotFoundData = {
        id: 'wrong-id'
      }
      delete_retail(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

})