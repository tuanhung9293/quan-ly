'use strict'

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

  function unassign_data (data, callback) {
    seneca.act('role:supplier, cmd:unassign', data, callback)
  }

  it("can unassign with corrrect supplier's id and supplier group's id", function (done) {
    var correctData = { supplier_group_id: supplierGroups[ 1 ].id, supplier_id: suppliers[ 3 ].id }
    assign_data(correctData, function (err, respond) {
      var perfectData = { supplier_group_id: respond.assign.supplier_group_id, supplier_id: respond.assign.supplier_id }
      unassign_data(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.message).to.equal('deleted')
        expect(respond.assign).not.exist()
        done()
      })
    })
  })

  //--------------------------------------------------------------------------------------------------------------------

  it("can NOT unassign with missing supplier's id and supplier group's id", function (done) {
    var correctData = { supplier_group_id: supplierGroups[ 0 ].id, supplier_id: suppliers[ 3 ].id }
    assign_data(correctData, function (err, respond) {
      var missingData = {}
      unassign_data(missingData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it("can NOT unassign with wrong supplier's id and supplier group's id", function (done) {
    var correctData = { supplier_group_id: supplierGroups[ 0 ].id, supplier_id: suppliers[ 3 ].id }
    assign_data(correctData, function (err, respond) {
      var wrongData = { supplier_group_id: 'wrongsupplierGroupID', supplier_id: 'wrongsupplierID' }
      unassign_data(wrongData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('assign-not-exist')
        done()
      })
    })
  })
})