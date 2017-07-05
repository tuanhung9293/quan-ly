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

describe('role:product, cmd:update', function () {
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

  function update_product (data, callback) {
    seneca.act('role:product, cmd:update', data, callback)
  }

  var testData = {
    name: 'test-name',
    cost: 24000,
    price: 30000
  }

  it('can update product with perfect data', function (done) {
    add_product(testData, function (err, respond) {
      var perfectData = {
        id: respond.product.id,
        name: 'updateName',
        unit: 'meter',
        cost: 20000,
        price: 50000,
        status: 'inactive'
      }
      update_product(perfectData, function (err, respond) {
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
    add_product(testData, function (err, respond) {
      var missingData = {
        id: respond.product.id,
        name: 'updateName',
      }
      update_product(missingData, function (err, respond) {
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
    add_product(testData, function (err, respond) {
      var wrongTypeData = {
        id: respond.product.id,
        name: 'updateName',
        cost: '250000',
        price: '500000'
      }
      update_product(wrongTypeData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.product.id).to.be.exist()
        expect(respond.product.name).to.equal(wrongTypeData.name)
        expect(respond.product.cost).to.equal(250000)
        expect(respond.product.price).to.equal(500000)
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

  var callback_with_cost_higher_than_price = function (done) {
    return function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('cost-must-be-less-than-or-equal-price')
      done()
    }
  }

  it('can NOT update product with too short name', function (done) {
    add_product(testData, function (err, respond) {
      var shortNameData = {
        id: respond.product.id,
        name: 'a',
        unit: 'meter',
        cost: 30000,
        price: 40000,
        status: 'inactive'
      }
      update_product(shortNameData, invalidCallback(done))
    })
  })

  it('can NOT update product with wrong unit', function (done) {
    add_product(testData, function (err, respond) {
      var wrongUnitData = {
        id: respond.product.id,
        name: 'wrong-name',
        unit: 'wrong-unit',
        cost: 30000,
        price: 40000,
        status: 'inactive'
      }
      update_product(wrongUnitData, invalidCallback(done))
    })
  })

  it('can NOT update product with wrong status', function (done) {
    add_product(testData, function (err, respond) {
      var wrongStatusData = {
        id: respond.product.id,
        name: 'wrong-name',
        unit: 'liter',
        cost: 30000,
        price: 40000,
        status: 'deleted'
      }
      update_product(wrongStatusData, invalidCallback(done))
    })
  })

  //TODO: can NOT update with cost and price are NAN

  it('can NOT update product without id', function (done) {
    add_product(testData, function (err, respond) {
      var undefinedIdData = {
        name: 'undefined-name',
        unit: 'meter',
        cost: 30000,
        price: 40000,
        status: 'inactive'
      }
      update_product(undefinedIdData, invalidCallback(done))
    })
  })

  it('can NOT update product with cost higher than price - cost and price update is not undefined', function (done) {
    add_product(testData, function (err, respond) {
      var wrongData = {
        id: respond.product.id,
        name: 'undefined-name',
        unit: 'meter',
        cost: 40000,
        price: 30000,
        status: 'inactive'
      }
      update_product(wrongData, callback_with_cost_higher_than_price(done))
    })
  })

  it('can NOT update product with cost higher than price - cost update is undefined', function (done) {
    add_product(testData, function (err, respond) {
      var wrongData = {
        id: respond.product.id,
        name: 'undefined-name',
        unit: 'meter',
        price: 20000,
        status: 'inactive'
      }
      update_product(wrongData, callback_with_cost_higher_than_price(done))
    })
  })

  it('can NOT update product with cost higher than price - price update is undefined', function (done) {
    add_product(testData, function (err, respond) {
      var wrongData = {
        id: respond.product.id,
        name: 'undefined-name',
        unit: 'meter',
        cost: 40000,
        status: 'inactive'
      }
      update_product(wrongData, callback_with_cost_higher_than_price(done))
    })
  })

  it('can NOT update product with wrong id', function (done) {
    add_product(testData, function (err, respond) {
      var wrongIdData = {
        id: '111111111111a',
        name: 'wrong-name',
        unit: 'meter',
        cost: 30000,
        price: 40000,
        status: 'inactive'
      }
      update_product(wrongIdData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })
})