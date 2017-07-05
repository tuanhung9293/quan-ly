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
const it = lab.it
const after = lab.after

var rowCustomers = [
  { name: 'test0', phone: '0901010100', email: 'test0@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test1', phone: '0901010101', email: 'test1@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test2', phone: '0901010102', email: 'test2@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test3', phone: '0901010103', email: 'test3@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test4', phone: '0901010104', email: 'test4@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test5', phone: '0901010105', email: 'test5@gmail.com', address: '123', status: 'inactive' }
]

var rowCustomerGroups = [
  { name: 'test0', status: 'active' },
  { name: 'test1', status: 'active' },
  { name: 'test2', status: 'active' },
  { name: 'test3', status: 'active' },
  { name: 'test4', status: 'active' },
  { name: 'test5', status: 'inactive' }
]

describe('role:customer, cmd:assign', function () {
  after(function(done) {
    seneca.make$('company', 'customer').native$(function (err, db) {
      var collection = db.collection('company_customer_group');
      collection.drop()
      done()
    })
  })

  var customers = []
  var customerGroups = []

  var add_customers = function () {
    return function (next) {
      Async.map(rowCustomers, function (item, mapNext) {
        seneca.act('role:customer, cmd:add', item, function (err, respond) {
          mapNext(null, respond.customer.data$())
        })
      }, function (err, results) {
        customers = results
        customers.sort(function (a, b) {
          if (a.name > b.name) {
            return 1
          } else if (a.name < b.name) {
            return -1
          }
          return 0
        })
        next()
      })
    }
  }

  var add_customer_groups = function () {
    return function (next) {
      Async.map(rowCustomerGroups, function (item, mapNext) {
        seneca.act('role:customer, cmd:add-group', item, function (err, respond) {
          mapNext(null, respond.customer_group.data$())
        })
      }, function (err, results) {
        customerGroups = results
        customerGroups.sort(function (a, b) {
          if (a.name > b.name) {
            return 1
          } else if (a.name < b.name) {
            return -1
          }
          return 0
        })
        next()
      })
    }
  }

  before(function (done) {
    Async.waterfall([
      add_customers(),
      add_customer_groups()
    ], function () {
      done()
    })
  })

  function assignData (data, callback) {
    seneca.act('role:customer, cmd:assign', data, callback)
  }

  function unassignData (data, callback) {
    seneca.act('role:customer, cmd:unassign', data, callback)
  }

  it("can unassign with corrrect customer's id and customer group's id", function (done) {
    var correctData = { customer_group_id: customerGroups[ 1 ].id, customer_id: customers[ 3 ].id }
    assignData(correctData, function (err, respond) {
      var perfectData = { customer_group_id: respond.assign.customer_group_id, customer_id: respond.assign.customer_id }
      unassignData(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.message).to.equal('deleted')
        expect(respond.assign).not.exist()
        done()
      })
    })
  })

  //--------------------------------------------------------------------------------------------------------------------

  it("can NOT unassign with missing customer's id and customer group's id", function (done) {
    var correctData = { customer_group_id: customerGroups[ 0 ].id, customer_id: customers[ 3 ].id }
    assignData(correctData, function (err, respond) {
      var missingData = {}
      unassignData(missingData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it("can NOT unassign with wrong customer's id and customer group's id", function (done) {
    var correctData = { customer_group_id: customerGroups[ 0 ].id, customer_id: customers[ 3 ].id }
    assignData(correctData, function (err, respond) {
      var wrongData = { customer_group_id: 'wrongCustomerGroupID', customer_id: 'wrongCustomerID' }
      unassignData(wrongData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('assign-not-exist')
        done()
      })
    })
  })

})