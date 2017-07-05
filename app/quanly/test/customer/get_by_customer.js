'use strict'

process.env.COMPANY = 'default'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const Async = require('async')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const before = lab.before
const after = lab.after
const it = lab.it

var rowCustomers = [
  { name: 'test0', phone: '0901010100', email: 'test0@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test1', phone: '0901010101', email: 'test1@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test2', phone: '0901010102', email: 'test2@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test3', phone: '0901010103', email: 'test3@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test4', phone: '0901010104', email: 'test4@gmail.com', address: '123 Penn.', status: 'active' }
]

var rowCustomerGroups = [
  { name: 'test0', status: 'active' },
  { name: 'test1', status: 'active' },
  { name: 'test2', status: 'active' },
  { name: 'test3', status: 'active' },
  { name: 'test4', status: 'active' }
]

describe('role:customer, cmd:get-by-customer', function () {
  after(function (done) {
    seneca.make$('company', 'customer').native$(function (err, db) {
      var collection = db.collection('company_customer');
      collection.drop()
      seneca.make$('company', 'customer_group').native$(function (err, db) {
        var collection = db.collection('company_customer_group');
        collection.drop()
        seneca.make$('customer', 'group').native$(function (err, db) {
          var collection = db.collection('customer_group');
          collection.drop()
          done()
        })
      })
    })
  })

  var customers = []
  var customerGroups = []

  var add_customers = function (done) {
    Async.map(rowCustomers, function (item, mapNext) {
      seneca.act('role:customer, cmd:add', item, function (err, respond) {
        mapNext(null, respond.customer.data$())
      })
    }, function (err, results) {
      customers = results
      done()
    })
  }

  var add_customer_groups = function (done) {
    Async.map(rowCustomerGroups, function (item, mapNext) {
      seneca.act('role:customer, cmd:add-group', item, function (err, respond) {
        mapNext(null, respond.customer_group.data$())
      })
    }, function (err, results) {
      customerGroups = results
      done()
    })
  }

  var assign_data_0 = function (done) {
    seneca.act('role:customer, cmd:assign', {
      customer_group_id: customerGroups[ 2 ].id,
      customer_id: customers[ 1 ].id
    }, function (err, respond) {
      seneca.act('role:customer, cmd:assign', {
        customer_group_id: customerGroups[ 0 ].id,
        customer_id: customers[ 1 ].id
      }, function (err, respond) {
        seneca.act('role:customer, cmd:assign', {
          customer_group_id: customerGroups[ 3 ].id,
          customer_id: customers[ 1 ].id
        }, function (err, respond) {
          done()
        })
      })
    })
  }

  var assign_data_1 = function (done) {
    seneca.act('role:customer, cmd:assign', {
      customer_group_id: customerGroups[ 4 ].id,
      customer_id: customers[ 2 ].id
    }, function (err, respond) {
      seneca.act('role:customer, cmd:assign', {
        customer_group_id: customerGroups[ 2 ].id,
        customer_id: customers[ 2 ].id
      }, function (err, respond) {
        seneca.act('role:customer, cmd:assign', {
          customer_group_id: customerGroups[ 3 ].id,
          customer_id: customers[ 2 ].id
        }, function (err, respond) {
          done()
        })
      })
    })
  }

  before(function (done) {
    Async.waterfall([
        add_customers,
        add_customer_groups,
        assign_data_0,
        assign_data_1
      ],
      done)
  })

  function get_by_customer (data, callback) {
    seneca.act('role:customer, cmd:get-by-customer', data, callback)
  }

  it('can get customer groups information by customer', function (done) {
    get_by_customer({ customer_id: customers[ 1 ].id, query: { sort$: { name: 1 } } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.customer_groups.length).to.equal(3)
      expect(respond.customer_groups[ 0 ].data$()).to.include(customerGroups[ 0 ])
      expect(respond.customer_groups[ 1 ].data$()).to.include(customerGroups[ 2 ])
      expect(respond.customer_groups[ 2 ].data$()).to.include(customerGroups[ 3 ])
      done()
    })
  })

  it('can get customer groups id by customer with customer_group_infor is false', function (done) {
    get_by_customer({ customer_id: customers[ 2 ].id, customer_group_info: false }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.customerGroupIds.length).to.equal(3)
      done()
    })
  })

  //--------------------------------------------------------------------------------------------------------------------

  it("can NOT get customer groups information by customer without customer's id", function(done){
    get_by_customer({}, function(err, respond){
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    })
  })

  it("can NOT get customer groups information by customer with wrong customer's id" , function(done){
    var wrongCustomerId = 'wrongId'
    get_by_customer({customer_id: wrongCustomerId}, function(err, respond){
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('not-found')
      done()
    })
  })
})