'use strict'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:product, cmd:update', function () {
  after(function (done) {
    seneca.make$('company', 'product').native$(function (err, db) {
      var collection = db.collection('company_product');
      collection.drop()
      done()
    })
  })

  function add_product_book (data, callback) {
    seneca.act('role:product, cmd:add', data, callback)
  }

  function update_product_book (data, callback) {
    seneca.act('role:product, cmd:update', data, callback)
  }

  var testData = {
    type: 'book',
    name: 'perfect-name',
    unit: 'unit',
    default_price: 100000,
    cost_discount_rate: 30.5,
    price_discount_rate: 20.5,
    cost: 70000,
    price: 80000
  }

  it('can update product with perfect data', function (done) {
    add_product_book(testData, function (err, respond) {
      var perfectData = {
        type: 'book',
        id: respond.product.id,
        name: 'updateName',
        default_price: 900000,
        cost_discount_rate: 55,
        price_discount_rate: 45,
        unit: 'unit',
        cost: 20000,
        price: 50000,
        status: 'inactive'
      }
      update_product_book(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.product.id).to.be.exist()
        expect(respond.product).to.include(perfectData)
        expect(respond.product.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update product with missing optinal data', function (done) {
    add_product_book(testData, function (err, respond) {
      var missingData = {
        id: respond.product.id,
        name: 'updateName',
      }
      update_product_book(missingData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.product.id).to.be.exist()
        expect(respond.product.name).to.equal(missingData.name)
        expect(respond.product.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update product with wrong type required data', function (done) {
    add_product_book(testData, function (err, respond) {
      var wrongTypeData = {
        type: 'book',
        id: respond.product.id,
        name: 'updateName',
        default_price: '900000',
        cost_discount_rate: '55',
        price_discount_rate: '45',
        unit: 'unit',
        cost: '20000',
        price: '50000',
        status: 'inactive'
      }
      var expectData = {
        type: 'book',
        id: respond.product.id,
        name: 'updateName',
        default_price: 900000,
        cost_discount_rate: 55,
        price_discount_rate: 45,
        unit: 'unit',
        cost: 20000,
        price: 50000,
        status: 'inactive'
      }
      update_product_book(wrongTypeData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.product.id).to.be.exist()
        expect(respond.product.name).to.equal(wrongTypeData.name)
        expect(respond.product).to.include(expectData)
        expect(respond.product.updated_at).to.be.exist()
        done()
      })
    })
  })

  //-------------------------------------------------------------------------------------------------

  var invalidCallback = function (done) {
    return function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    }
  }

  it('can NOT update product with wrong unit', function (done) {
    add_product_book(testData, function (err, respond) {
      var wrongUnitData = {
        type: 'book',
        id: respond.product.id,
        name: 'wrong-name',
        default_price: 900000,
        cost_discount_rate: 55,
        price_discount_rate: 45,
        unit: 'book',
        cost: 20000,
        price: 50000,
        status: 'inactive'
      }
      update_product_book(wrongUnitData, invalidCallback(done))
    })
  })

  //TODO: can NOT update with cost and price are NAN

  it('can NOT update product with price higher than default_price', function (done) {
    add_product_book(testData, function (err, respond) {
      var wrongData = {
        type: 'book',
        id: respond.product.id,
        name: 'updateName',
        default_price: 900000,
        cost_discount_rate: 55,
        price_discount_rate: 45,
        unit: 'unit',
        cost: 30000,
        price: 5000000,
        status: 'inactive'
      }
      update_product_book(wrongData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('default_price-must-be-higher-price')
        done()
      })
    })
  })

  it('can NOT update product with price_discount_rate higher than cost_discount_rate', function (done) {
    add_product_book(testData, function (err, respond) {
      var wrongData = {
        type: 'book',
        id: respond.product.id,
        name: 'updateName',
        default_price: 400000,
        cost_discount_rate: 55,
        price_discount_rate: 60,
        unit: 'unit',
        cost: 30000,
        price: 300000,
        status: 'inactive'
      }
      update_product_book(wrongData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('cost_discount_rate-must-be-higher-than-price_discount_rate')
        done()
      })
    })
  })
})