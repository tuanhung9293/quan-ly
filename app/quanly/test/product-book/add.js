'use strict'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')
const Lodash = require('lodash')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:product, cmd:add, type:book', function () {
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

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.product.created_at).to.be.exist()
    expect(respond.product.updated_at).to.be.exist()
    expect(respond.product.status).to.equal('active')
  }

  it('can add product book with perfect data', function (done) {
    var perfectProductBookData = {
      type: 'book',
      id: '8936046617891',
      name: 'perfect-name',
      unit: 'unit',
      default_price: 100000,
      cost_discount_rate: 30.5,
      price_discount_rate: 20.5,
      cost: 70000,
      price: 80000
    }

    add_product_book(perfectProductBookData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.product.id).to.be.exist()
      expect(respond.product).to.include(perfectProductBookData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add product book with missing optional data', function (done) {
    var missingData = {
      type: 'book',
      name: 'perfect-name',
      default_price: 100000,
      cost_discount_rate: 30.5,
      price_discount_rate: 20.5
    }
    var expectedData = Lodash.assign({}, missingData, {
      unit: 'unit'
    })

    add_product_book(missingData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.product.id).to.be.exist()
      expect(respond.product.cost).to.be.exist()
      expect(respond.product.price).to.be.exist()
      expect(respond.product).to.include(expectedData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add product book with required wrong type data', function (done) {
    var optionalWrongData = {
      type: 'book',
      name: 'missing-name',
      default_price: '100000',
      cost: '20000',
      price: '25000',
      cost_discount_rate: '30.5',
      price_discount_rate: '20.5'
    }
    var expectedData = {
      type: 'book',
      name: 'missing-name',
      unit: 'unit',
      default_price: 100000,
      cost: 20000,
      price: 25000,
      cost_discount_rate: 30.5,
      price_discount_rate: 20.5
    }
    add_product_book(optionalWrongData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.product.id).to.be.exist()
      expect(respond.product).to.include(expectedData)
      expect_timestamp_fields_and_status(respond)
      done()
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

  it('can NOT add product book with empty data', function (done) {
    var missingData = {}
    add_product_book(missingData, invalidCallback(done))
  })

  it('can NOT add product book with wrong unit', function (done) {
    var wrongUnitData = {
      type: 'book',
      name: 'perfect-name',
      unit: 'book',
      default_price: 100000,
      cost_discount_rate: 30.5,
      price_discount_rate: 20.5,
      cost: 70000,
      price: 80000
    }
    add_product_book(wrongUnitData, invalidCallback(done))
  })

  //TODO: test can NOT add with default_price, cost_discount_rate, price_discount_rate cost and price are NAN

  it('can NOT add product with price higher than default_price', function (done) {
    var wrongData = {
      type: 'book',
      name: 'perfect-name',
      unit: 'unit',
      default_price: 100000,
      cost_discount_rate: 30.5,
      price_discount_rate: 20.5,
      cost: 90000,
      price: 800000
    }
    add_product_book(wrongData, function (err, respond) {
      expect(err).not.exist
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('default_price-must-be-higher-price')
      done()
    })
  })

  it('can NOT add product with price_discount_rate higher than cost_discount_rate', function (done) {
    var wrongData = {
      type: 'book',
      name: 'perfect-name',
      unit: 'unit',
      default_price: 100000,
      cost_discount_rate: 30.5,
      price_discount_rate: 40.5,
      cost: 70000,
      price: 80000
    }
    add_product_book(wrongData, function (err, respond) {
      expect(err).not.exist
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('cost_discount_rate-must-be-higher-than-price_discount_rate')
      done()
    })
  })

  it('can NOT add product book with product is existing', function (done) {
    var existingData = {
      type: 'book',
      id: '8936046617891',
      name: 'perfect-name',
      unit: 'unit',
      default_price: 100000,
      cost_discount_rate: 30.5,
      price_discount_rate: 20.5,
      cost: 70000,
      price: 80000
    }
    add_product_book(existingData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('product-existing')
      done()
    })
  })
})