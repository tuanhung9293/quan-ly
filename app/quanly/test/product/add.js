'use strict'

process.env.COMPANY = 'default'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')
const Lodash = require('lodash')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:product, cmd:add', function () {
  after(function(done) {
    seneca.make$('company', 'product').native$(function (err, db) {
      var collection = db.collection('company_product');
      collection.drop()
      done()
    })
  })

  function add_product (data, callback) {
    seneca.act('role:product, cmd:add', data, callback)
  }

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.product.created_at).to.be.exist()
    expect(respond.product.updated_at).to.be.exist()
    expect(respond.product.status).to.equal('active')
  }

  it('can add product with perfect data', function (done) {
    var perfectData = {
      id: '8936046617891',
      name: 'perfect-name',
      unit: 'unit',
      cost: 25000,
      price: 50000
    }
    add_product(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.product.id).to.be.exist()
      expect(respond.product).to.include(perfectData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add product with missing optional data', function (done) {
    var missingData = {
      name: 'perfect-name',
      cost: 25000,
      price: 50000
    }
    var expectedData = Lodash.assign({}, missingData, {
      unit: 'unit'
    })
    add_product(missingData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.product.id).to.be.exist()
      expect(respond.product).to.include(expectedData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add product with required wrong type data', function (done) {
    var optionalWrongData = {
      name: 'missing-name',
      cost: '20000',
      price: '25000',
    }
    var expectedData = {
      name: 'missing-name',
      unit: 'unit',
      cost: 20000,
      price: 25000
    }
    add_product(optionalWrongData, function (err, respond) {
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

  it('can NOT add product with required data', function (done) {
    var missingData = {}
    add_product(missingData, invalidCallback(done))
  })

  it('can NOT add product with too short name', function (done) {
    var shortNameData = {
      id: '2688442228114',
      name: 'a',
      unit: 'unit',
      cost: 25000,
      price: 30000
    }
    add_product(shortNameData, invalidCallback(done))
  })

  it('can NOT add product with wrong unit', function (done) {
    var wrongUnitData = {
      id: '2686293390899',
      name: 'wrong-name',
      unit: 'wrong-unit',
      cost: 25000,
      price: 30000
    }
    add_product(wrongUnitData, invalidCallback(done))
  })

  //TODO: test can NOT add with cost and price are NAN

  it('can NOT add product with cost higher than price', function (done) {
    var wrongUnitData = {
      id: '2686293390899',
      name: 'wrongName',
      unit: 'unit',
      cost: 50000,
      price: 30000
    }
    add_product(wrongUnitData, function (err, respond) {
      expect(err).not.exist
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('cost-must-be-less-than-or-equal-price')
      done()
    })
  })

  it('can NOT add product with wrong id', function (done) {
    var incorrectIdData = {
      id: '2684729337125',
      name: 'incorrect-name',
      unit: 'unit',
      cost: 25000,
      price: 30000
    }
    add_product(incorrectIdData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('id-is-incorrect')
      done()
    })
  })

  it('can NOT add product with product is existing', function (done) {
    var existingData = {
      id: '8936046617891',
      name: 'existing-name',
      unit: 'unit',
      cost: '250000',
      price: '300000'
    }
    add_product(existingData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('product-existing')
      done()
    })
  })
})