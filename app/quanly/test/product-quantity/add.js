'use strict'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:product-quantity, cmd:add', function () {
  after(function (done) {
    seneca.make$('product', 'quantities').native$(function (err, db) {
      var collection = db.collection('product_quantities');
      collection.drop()
      done()
    })
  })

  function add_product_quantity (data, callback) {
    seneca.act('role:product-quantity, cmd:add', data, callback)
  }

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.productQuantity.created_at).to.be.exist()
    expect(respond.productQuantity.status).to.equal('active')
  }

  it('can add with perfect data', function (done) {
    var perfectData = {
      product_type: 'book',
      product_id: '8936046617891',
      item_type: 'export ticket',
      item_id: '8936046617891abcd',
      count: 5,
      action: 'export',
      description: 'phieu xuat hang'
    }
    add_product_quantity(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.productQuantity.id).to.be.exist()
      expect(respond.productQuantity).to.include(perfectData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add with missing optional data', function (done) {
    var missingData = {
      product_type: 'book',
      product_id: '8936062800352',
      item_type: 'export ticket',
      item_id: '8936046617891abcde',
      count: 7,
      action: 'export'
    }
    add_product_quantity(missingData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.productQuantity.id).to.be.exist()
      expect(respond.productQuantity.product_id).to.equal(missingData.product_id)
      expect(respond.productQuantity.item_type).to.equal(missingData.item_type)
      expect(respond.productQuantity.item_id).to.equal(missingData.item_id)
      expect(respond.productQuantity.count).to.equal(missingData.count)
      expect(respond.productQuantity.action).to.equal(missingData.action)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add with optional wrong type data', function (done) {
    var optionalWrongData = {
      product_type: 'book',
      product_id: '8935095615971',
      item_type: 'export ticket',
      item_id: '8936046617891abcd',
      count: '9',
      action: 'export',
      description: 'phieu xuat hang',
    }
    var expectedData = {
      product_type: 'book',
      product_id: '8935095615971',
      item_type: 'export ticket',
      item_id: '8936046617891abcd',
      count: 9,
      action: 'export',
      description: 'phieu xuat hang'
    }
    add_product_quantity(optionalWrongData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.productQuantity.id).to.be.exist()
      expect(respond.productQuantity).to.include(expectedData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add with count is negative', function (done) {
    var countNegativeData = {
      product_type: 'book',
      product_id: '8935095615971',
      item_type: 'export ticket',
      item_id: '8936046617891abcd',
      count: -9,
      action: 'export',
      description: 'phieu xuat hang',
    }
    add_product_quantity(countNegativeData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.productQuantity.id).to.be.exist()
      expect(respond.productQuantity).to.include(countNegativeData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  //-------------------------------------------------------------------------------------------------

  var invalid_callback = function (done) {
    return function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    }
  }

  it('can NOT add a product quantity log with missing required data', function (done) {
    var missingData = {
      description: 'phieu xuat hang'
    }
    add_product_quantity(missingData, invalid_callback(done))
  })

  //TODO: test can NOT add with count is NAN

  it('can NOT add a product quantity log with wrong status', function (done) {
    var wrongStatusData = {
      product_type: 'book',
      product_id: '8935095615971',
      item_type: 'export ticket',
      item_id: '8936046617891abcd',
      count: 9,
      action: 'export',
      description: 'phieu xuat hang',
      status: 'inactive'
    }
    add_product_quantity(wrongStatusData, invalid_callback(done))
  })
})