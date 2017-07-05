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

describe('role:customer, cmd:delete-group', function () {
  after(function(done) {
    seneca.make$('company', 'customer_group').native$(function (err, db) {
      var collection = db.collection('company_customer_group');
      collection.drop()
      done()
    })
  })

  it('can delete with correct id', function (done) {
    seneca.act('role:customer, cmd: add-group', { name: 'name1' }, function (err, respond) {
      var id = respond.customer_group.id
      seneca.act('role:customer, cmd:delete-group', { id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.customer_group.status).to.equal('deleted')
        expect(respond.customer_group.updated_at).to.be.exist()
        done()
      })
    })
  })

  //---------------------------------------------------------------------------------------------------------

  it('can NOT delete customer group without id', function (done) {
    seneca.act('role:customer, cmd: add-group', { name: 'name2' }, function (err, respond) {
      seneca.act('role:customer, cmd:delete-group', {}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT delete customer group with wrong id', function (done) {
    seneca.act('role:customer, cmd: add-group', { name: 'name3' }, function (err, respond) {
      var id = 'invalid-id'
      seneca.act('role:customer, cmd:delete-group', { id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

})