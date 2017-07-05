'use strict'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:product-quantity, cmd:delete', function () {
  after(function (done) {
    seneca.make$('product', 'quantities').native$(function (err, db) {
      var collection = db.collection('product_quantities');
      collection.drop()
      done()
    })
  })

  var testData = {
    product_type: 'book',
    product_id: '8936046617891',
    item_type: 'export ticket',
    item_id: '8936as047891abcd',
    count: 5,
    action: 'export',
    description: 'phieu xuat hang'
  }

  it('can delete product with correct id', function (done) {
    seneca.act('role:product-quantity, cmd: add', testData, function (err, respond) {
      var id = respond.productQuantity.id
      seneca.act('role:product-quantity, cmd:delete', { id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.productQuantity.status).to.equal('deleted')
        expect(respond.productQuantity.deleted_at).to.be.exist()
        done()
      })
    })
  })

  //---------------------------------------------------------------------------------------------------------

  it('can NOT delete product without id', function (done) {
    seneca.act('role:product-quantity, cmd: add', testData, function (err, respond) {
      seneca.act('role:product-quantity, cmd:delete', {}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT delete product with wrong id', function (done) {
    seneca.act('role:product-quantity, cmd: add', testData, function (err, respond) {
      var id = 'invalid-id'
      seneca.act('role:product-quantity, cmd:delete', { id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })
})