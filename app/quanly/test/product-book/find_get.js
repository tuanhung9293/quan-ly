'use strict'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')
const Lodash = require('lodash')
const Async = require('async')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const before = lab.before
const it = lab.it
const after = lab.after

var rowProductBooks = [
  {
    type: 'book',
    name: 'test0',
    unit: 'unit',
    default_price: 50000,
    cost_discount_rate: 15,
    price_discount_rate: 10,
    cost: 10000,
    price: 30000,
    status: 'active'
  },
  {
    type: 'book',
    name: 'test1',
    unit: 'unit',
    default_price: 50000,
    cost_discount_rate: 15,
    price_discount_rate: 10,
    cost: 10000,
    price: 30000,
    status: 'active'
  },
  {
    type: 'book',
    name: 'test2',
    unit: 'unit',
    default_price: 80000,
    cost_discount_rate: 18,
    price_discount_rate: 15,
    cost: 30000,
    price: 60000,
    status: 'inactive'
  },
  {
    type: 'book',
    name: 'test3',
    unit: 'unit',
    default_price: 90000,
    cost_discount_rate: 18,
    price_discount_rate: 15,
    cost: 40000,
    price: 60000,
    status: 'inactive'
  },
  {
    type: 'book',
    name: 'test4',
    unit: 'unit',
    default_price: 50000,
    cost_discount_rate: 20,
    price_discount_rate: 18,
    cost: 10000,
    price: 40000,
    status: 'inactive'
  },
  {
    type: 'book',
    name: 'test5',
    unit: 'unit',
    default_price: 50000,
    cost_discount_rate: 20,
    price_discount_rate: 18,
    cost: 10000,
    price: 40000,
    status: 'inactive'
  },
  {
    type: 'book',
    name: 'test6',
    unit: 'unit',
    default_price: 50000,
    cost_discount_rate: 20,
    price_discount_rate: 18,
    cost: 10000,
    price: 30000,
    status: 'active'
  }
]

describe('role:product, cmd:find|get', function () {
  after(function (done) {
    seneca.make$('company', 'product').native$(function (err, db) {
      var collection = db.collection('company_product');
      collection.drop()
      done()
    })
  })

  var productBooks = []

  var add_product_books = function (done) {
    Async.map(rowProductBooks, function (item, mapNext) {
      seneca.act('role:product, cmd:add', item, function (err, respond) {
        mapNext(null, respond.product.data$())
      })
    }, function (err, results) {
      productBooks = results
      seneca.act('role:product, cmd:delete', { id: productBooks[ 4 ].id, type: 'book' }, function (err, respond) {
        productBooks[ 4 ] = respond.product.data$()
        seneca.act('role:product, cmd:delete', { id: productBooks[ 5 ].id, type: 'book' }, function (err, respond) {
          productBooks[ 5 ] = respond.product.data$()
          done()
        })
      })
    })
  }

  before(function (done) {
    Async.waterfall([
        add_product_books
      ],
      done)
  })

  function find_product_book (data, callback) {
    seneca.act('role:product, cmd:find', data, callback)
  }

  it('can find by single field', function (done) {
    find_product_book({ id: productBooks[ 0 ].id, type: 'book' }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.product.data$()).to.include(productBooks[ 0 ])

      find_product_book({ name: productBooks[ 1 ].name, type: 'book' }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.product.data$()).to.include(productBooks[ 1 ])

        var findData = { status: productBooks[ 4 ].status, query: { sort$: { name: 1 } }, type: 'book', }
        find_product_book(findData, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.product.data$()).to.include(productBooks[ 4 ])
          done()
        })
      })
    })
  })

  it('can find by multiple fields', function (done) {
    var findMultipleData = { id: productBooks[ 1 ].id, name: productBooks[ 1 ].name, type: 'book' }
    find_product_book(findMultipleData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.product.data$()).to.include(productBooks[ 1 ])

      find_product_book(productBooks[ 5 ], function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.product.data$()).to.include(productBooks[ 5 ])
        done()
      })
    })
  })

  it('can find by query', function (done) {
    find_product_book({ type: 'book', query: { name: productBooks[ 6 ].name } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.product.data$()).to.include(productBooks[ 6 ])
      done()
    })
  })

  it('can find with no result', function (done) {
    var findData = { id: productBooks[ 1 ].id, name: productBooks[ 0 ].name, type: 'book' }
    find_product_book(findData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.product).to.not.exist()
      done()
    })
  })

  it('just returns one and only one entity', function (done) {
    find_product_book({ status: productBooks[ 4 ].status, type: 'book' }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      if (respond.product.id == productBooks[ 4 ].id) {
        expect(respond.product.data$()).to.include(productBooks[ 4 ])
      } else {
        expect(respond.product.data$()).to.include(productBooks[ 5 ])
      }
      done()
    })
  })

  //--------------------------------------------------------------------------------------------------------------------

  function get_product_books (data, callback) {
    seneca.act('role:product, cmd:get', data, callback)
  }

  it('can get by single field', function (done) {
    get_product_books({ default_price: productBooks[ 0 ].default_price, type: 'book' }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.products.length).to.equal(3)

      get_product_books({ status: productBooks[ 2 ].status, type: 'book' }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.products.length).to.equal(2)

        get_product_books({ status: productBooks[ 4 ].status, type: 'book' }, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.products.length).to.equal(2)
          done()
        })
      })
    })
  })

  it('can get product books active by single field', function (done) {
    var findData = { cost: productBooks[ 0 ].cost, query: { sort$: { name: 1 } }, type: 'book' }
    get_product_books(findData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.products.length).to.equal(3)
      expect(respond.products[ 0 ].data$()).to.include(productBooks[ 0 ])
      expect(respond.products[ 1 ].data$()).to.include(productBooks[ 1 ])
      expect(respond.products[ 2 ].data$()).to.include(productBooks[ 6 ])
      done()
    })
  })

  it('can get product books active by multiple field', function (done) {
    var findDataTest1 = { cost: productBooks[ 0 ].cost, status: productBooks[ 0 ].status, type: 'book' }
    var findDataTest2 = { price: productBooks[ 2 ].price, status: productBooks[ 2 ].status, type: 'book' }
    get_product_books(findDataTest1, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.products.length).to.equal(3)

      get_product_books(findDataTest2, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.products.length).to.equal(2)

        get_product_books(productBooks[ 5 ], function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.products[ 0 ].data$()).to.include(productBooks[ 5 ])
          done()
        })
      })
    })
  })

  it('can find by query use sort$', function (done) {
    get_product_books({ type: 'book', query: { cost: 10000, sort$: { name: -1 } } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.products[ 0 ].data$()).to.include(productBooks[ 6 ])
      expect(respond.products[ 1 ].data$()).to.include(productBooks[ 1 ])
      expect(respond.products[ 2 ].data$()).to.include(productBooks[ 0 ])
      done()
    })
  })

  it('can find by query use sort$ and limit$', function (done) {
    var findData = { type: 'book', query: { price_discount_rate: 10, sort$: { name: -1 }, limit$: 1 } }
    get_product_books(findData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.products[ 0 ].data$()).to.include(productBooks[ 1 ])
      done()
    })
  })
})