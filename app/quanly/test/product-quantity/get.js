'use strict'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')
const Async = require('async')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const before = lab.before
const it = lab.it
const after = lab.after

var rowProductQuantities = [
  {
    product_type: 'book',
    product_id: '8936046617891',
    item_type: 'export ticket',
    item_id: '8936046617891abc0',
    count: 1,
    action: 'export',
    description: 'phieu xuat hang',
    status: 'active'
  },
  {
    product_type: 'book',
    product_id: '8936062800352',
    item_type: 'export ticket',
    item_id: '8936046617891abc1',
    count: 2,
    action: 'export',
    description: 'phieu xuat hang',
    status: 'active'
  },
  {
    product_type: 'default',
    product_id: '8935095615971',
    item_type: 'import ticket',
    item_id: '8936046617891abc2',
    count: 3,
    action: 'import',
    description: 'phieu nhap hang',
    status: 'active'
  },
  {
    product_type: 'default',
    product_id: '8935081111732',
    item_type: 'export ticket',
    item_id: '8936046617891abc5',
    count: 4,
    action: 'import',
    description: 'phieu xuat hang',
    status: 'deleted'
  },
  {
    product_type: 'default',
    product_id: '8935081111735',
    item_type: 'export ticket',
    item_id: '8936046617891abc6',
    count: 5,
    action: 'import',
    description: 'phieu xuat hang',
    status: 'deleted'
  }
]

describe('role:product-quantity, cmd:get', function () {
  after(function (done) {
    seneca.make$('product', 'quantities').native$(function (err, db) {
      var collection = db.collection('product_quantities');
      collection.drop()
      done()
    })
  })

  var productQuantities = []

  var add_product_quantities = function (done) {
    Async.map(rowProductQuantities, function (item, mapNext) {
      seneca.act('role:product-quantity, cmd:add', item, function (err, respond) {
        mapNext(null, respond.productQuantity.data$())
      })
    }, function (err, results) {
      productQuantities = results
      done()
    })
  }

  before(function (done) {
    Async.waterfall([
      add_product_quantities
    ], done)
  })

  function get_product_quantities (data, callback) {
    seneca.act('role:product-quantity, cmd:get', data, callback)
  }

  it('can get by single field', function (done) {
    var testDataCase1 = { product_type: productQuantities[ 0 ].product_type, query: { sort$: { count: 1 } } }
    get_product_quantities(testDataCase1, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.productQuantities.length).to.equal(2)
      expect(respond.productQuantities[ 0 ].data$()).to.include(productQuantities[ 0 ])
      expect(respond.productQuantities[ 1 ].data$()).to.include(productQuantities[ 1 ])

      var testDataCase2 = { status: productQuantities[ 3 ].status, query: { sort$: { count: 1 } } }
      get_product_quantities(testDataCase2, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.productQuantities.length).to.equal(2)
        expect(respond.productQuantities[ 0 ].data$()).to.include(productQuantities[ 3 ])
        expect(respond.productQuantities[ 1 ].data$()).to.include(productQuantities[ 4 ])
        done()
      })
    })
  })

  it('can get product quantity logs active by single field', function (done) {
    get_product_quantities({ action: productQuantities[ 2 ].action }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.productQuantities[ 0 ].data$()).to.include(productQuantities[ 2 ])
      done()
    })
  })

  it('can get product quantity logs by multiple field', function (done) {
    var testDataCase1 = { item_type: productQuantities[ 0 ].item_type, status: productQuantities[ 0 ].status }
    get_product_quantities(testDataCase1, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.productQuantities.length).to.equal(2)

      var testDataCase2 = { action: productQuantities[ 3 ].action, status: productQuantities[ 3 ].status }
      get_product_quantities(testDataCase2, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.productQuantities.length).to.equal(2)

        get_product_quantities(productQuantities[ 2 ], function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.productQuantities[ 0 ].data$()).to.include(productQuantities[ 2 ])
          done()
        })
      })
    })
  })

  it('can find by query use sort$', function (done) {
    get_product_quantities({ query: { product_type: 'book', sort$: { count: -1 } } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.productQuantities[ 0 ].data$()).to.include(productQuantities[ 1 ])
      expect(respond.productQuantities[ 1 ].data$()).to.include(productQuantities[ 0 ])
      done()
    })
  })

  it('can find by query use sort$ and limit$', function (done) {
    var testData = { query: { product_type: 'book', sort$: { count: -1 }, limit$: 1 } }
    get_product_quantities(testData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.productQuantities[ 0 ].data$()).to.include(productQuantities[ 1 ])
      done()
    })
  })
})