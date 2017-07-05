'use strict'

process.env.COMPANY = 'default'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:customer, cmd:delete', function () {
  after(function(done) {
    seneca.make$('company', 'customer').native$(function (err, db) {
      var collection = db.collection('company_customer');
      collection.drop()
      done()
    })
  })

  it('can delete with correct id', function (done) {
    seneca.act('role:customer, cmd: add', {
      name: 'name1',
      phone: '0980989809',
      email: 'email@gmail.com'
    }, function (err, respond) {
      var id = respond.customer.id
      seneca.act('role:customer, cmd:delete', { id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.customer.status).to.equal('deleted')
        expect(respond.customer.updated_at).to.be.exist()
        done()
      })
    })
  })

  //---------------------------------------------------------------------------------------------------------

  it('can NOT delete customer without id', function (done) {
    seneca.act('role:customer, cmd: add', {
      name: 'name2',
      phone: '012839291233',
      email: 'email6@gmail.com'
    }, function (err, respond) {
      seneca.act('role:customer, cmd:delete', {}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT delete customer with wrong id', function (done) {
    seneca.act('role:customer, cmd: add', {
      name: 'name6',
      phone: '012839291233',
      email: 'email6@gmail.com'
    }, function (err, respond) {
      var id = 'invalid-id'
      seneca.act('role:customer, cmd:delete', { id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })
})