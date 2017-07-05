'use strict'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const before = lab.before
const it = lab.it
const after = lab.after
var Async = require('async');

var rowSuppliers = [
  { name: 'test0', phone: '0901010100', email: 'test0@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test1', phone: '0901010101', email: 'test1@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test2', phone: '0901010102', email: 'test2@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test3', phone: '0901010103', email: 'test3@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test4', phone: '0901010104', email: 'test4@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test5', phone: '0901010105', email: 'test5@gmail.com', address: '123', status: 'inactive' }
]

var rowSupplierGroups = [
  { name: 'test0', status: 'active' },
  { name: 'test1', status: 'active' },
  { name: 'test2', status: 'active' },
  { name: 'test3', status: 'active' },
  { name: 'test4', status: 'active' },
  { name: 'test5', status: 'inactive' }
]

describe('role:supplier, cmd:assign', function () {
  after(function (done) {
    seneca.make$('company', 'supplier').native$(function (err, db) {
      var collection = db.collection('company_supplier');
      collection.drop()
      seneca.make$('company', 'supplier_group').native$(function (err, db) {
        var collection = db.collection('company_supplier_group');
        collection.drop()
        seneca.make$('company', 'supplier_supplier_group').native$(function (err, db) {
          var collection = db.collection('company_supplier_supplier_group');
          collection.drop()
          done()
        })
      })
    })  
  })

  var suppliers = []
  var supplierGroups = []

  var add_suppliers = function (next) {
    Async.map(rowSuppliers, function (item, mapNext) {
      seneca.act('role:supplier, cmd:add', item, function (err, respond) {
        mapNext(null, respond.supplier.data$())
      })
    }, function (err, results) {
      suppliers = results
      suppliers.sort(function (a, b) {
        return (a.name - b.name)
      })
      next()
    })
  }

  var add_supplier_groups = function (next) {
    Async.map(rowSupplierGroups, function (item, mapNext) {
      seneca.act('role:supplier, cmd:add-group', item, function (err, respond) {
        mapNext(null, respond.supplier_group.data$())
      })
    }, function (err, results) {
      supplierGroups = results
      supplierGroups.sort(function (a, b) {
        return (a.name - b.name)
      })
      next()
    })
  }

  before(function (done) {
    Async.waterfall([
      add_suppliers,
      add_supplier_groups
    ], function () {
      done()
    })
  })

  function assign_data (data, callback) {
    seneca.act('role:supplier, cmd:assign', data, callback)
  }

  it("can assign with correct supplier's id and supplier group's id", function (done) {
    var correctData = { supplier_group_id: supplierGroups[ 1 ].id, supplier_id: suppliers[ 3 ].id }
    assign_data(correctData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.assign).to.include(correctData)
      done()
    })
  })

  //--------------------------------------------------------------------------------------------------------------------

  var invalid_callback = function (done) {
    return function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      expect(respond.assign).not.exist()
      done()
    }
  }

  it("can NOT assign with missing supplier's id and supplier group's id", function (done) {
    var missingData = {}
    assign_data(missingData, invalid_callback(done))
  })

  it("can NOT assign with supplier group's status is not active", function (done) {
    var notActivesupplierGroup = { supplier_group_id: supplierGroups[ 5 ].id, supplier_id: suppliers[ 3 ].id }
    assign_data(notActivesupplierGroup, invalid_callback(done))
  })

  it("can NOT assign with supplier's status is not active", function (done) {
    var notActivesupplier = { supplier_group_id: supplierGroups[ 2 ].id, supplier_id: suppliers[ 5 ].id }
    assign_data(notActivesupplier, invalid_callback(done))
  })

  it("can NOT assign with wrong supplier's id and supplier group's id", function (done) {
    var wrongData = { supplier_group_id: 'wrongsupplierGroupID', supplier_id: 'wrongsupplierID' }
    assign_data(wrongData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('not-found')
      expect(respond.assign).not.exist()
      done()
    })
  })

  it("can NOT assign with pair is already exist", function (done) {
    var existData = { supplier_group_id: supplierGroups[ 1 ].id, supplier_id: suppliers[ 3 ].id }
    assign_data(existData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('assign-is-existing')
      expect(respond.assign).not.exist()
      done()
    })
  })
})