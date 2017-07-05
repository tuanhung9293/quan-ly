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

describe('role:product, cmd:delete', function () {
  after(function(done) {
    seneca.make$('company', 'product').native$(function (err, db) {
      var collection = db.collection('company_product');
      collection.drop()
      done()
    })
  })

  var testData = {
    name: 'test-name',
    cost: 24000,
    price: 30000
  }

  it('can delete product with correct id', function (done) {
    seneca.act('role:product, cmd: add', testData, function (err, respond) {
      var id = respond.product.id
      seneca.act('role:product, cmd:delete', { id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.product.status).to.equal('deleted')
        expect(respond.product.deleted_at).to.be.exist()
        done()
      })
    })
  })

  //---------------------------------------------------------------------------------------------------------

  it('can NOT delete product without id', function (done) {
    seneca.act('role:product, cmd: add', testData, function (err, respond) {
      seneca.act('role:product, cmd:delete', {}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT delete product with wrong id', function (done) {
    seneca.act('role:product, cmd: add', testData, function (err, respond) {
      var id = 'invalid-id'
      seneca.act('role:product, cmd:delete', { id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })
})