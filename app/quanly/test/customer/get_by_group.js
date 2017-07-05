'use strict'

process.env.COMPANY = 'default'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const seneca = require('../seneca')
const Async = require('async')

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

describe('role:customer, cmd:get-by-group', function () {
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

  var assign_data_group_0 = function (done) {
    seneca.act('role:customer, cmd:assign', {
      customer_group_id: customerGroups[ 0 ].id,
      customer_id: customers[ 0 ].id
    }, function (err, respond) {
      seneca.act('role:customer, cmd:assign', {
        customer_group_id: customerGroups[ 0 ].id,
        customer_id: customers[ 1 ].id
      }, function (err, respond) {
        seneca.act('role:customer, cmd:assign', {
          customer_group_id: customerGroups[ 0 ].id,
          customer_id: customers[ 2 ].id
        }, function (err, respond) {
          done()
        })
      })
    })
  }

  var assign_data_group_1 = function (done) {
    seneca.act('role:customer, cmd:assign', {
      customer_group_id: customerGroups[ 1 ].id,
      customer_id: customers[ 4 ].id
    }, function (err, respond) {
      seneca.act('role:customer, cmd:assign', {
        customer_group_id: customerGroups[ 1 ].id,
        customer_id: customers[ 2 ].id
      }, function (err, respond) {
        seneca.act('role:customer, cmd:assign', {
          customer_group_id: customerGroups[ 1 ].id,
          customer_id: customers[ 3 ].id
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
        assign_data_group_0,
        assign_data_group_1
      ],
      done)
  })

  function get_by_group (data, callback) {
    seneca.act('role:customer, cmd:get-by-group', data, callback)
  }

  it('can get customers information in customer group', function (done) {
    get_by_group({ customer_group_id: customerGroups[ 1 ].id, query: { sort$: { name: 1 } } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.customers.length).to.equal(3)
      expect(respond.customers[ 0 ].data$()).to.include(customers[ 2 ])
      expect(respond.customers[ 1 ].data$()).to.include(customers[ 3 ])
      expect(respond.customers[ 2 ].data$()).to.include(customers[ 4 ])
      done()
    })
  })

  it('can get customers id in customer group with customer_infor is false', function (done) {
    get_by_group({ customer_group_id: customerGroups[ 0 ].id, customer_info: false }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.customerIds.length).to.equal(3)
      done()
    })
  })

  //--------------------------------------------------------------------------------------------------------------------

  it("can NOT get customers information in group without customer group's id", function(done){
    get_by_group({}, function(err, respond){
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    })
  })

  it("can NOT get customers information in group with wrong customer group's id" , function(done){
    var wrongCustomerGroupId = 'wrongId'
    get_by_group({customer_group_id: wrongCustomerGroupId}, function(err, respond){
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('not-found')
      done()
    })
  })
})