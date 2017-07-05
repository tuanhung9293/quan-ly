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

var rowsuppliers = [
  { name: 'test0', phone: '0901010100', email: 'test0@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test1', phone: '0901010101', email: 'test1@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test2', phone: '0901010102', email: 'test2@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test3', phone: '0901010103', email: 'test3@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test4', phone: '0901010104', email: 'test4@gmail.com', address: '123 Penn.', status: 'active' }
]

var rowsupplierGroups = [
  { name: 'test0', status: 'active' },
  { name: 'test1', status: 'active' },
  { name: 'test2', status: 'active' },
  { name: 'test3', status: 'active' },
  { name: 'test4', status: 'active' }
]

describe('role:supplier, cmd:get-by-group', function () {
  after(function (done) {
    seneca.make$('company', 'supplier').native$(function (err, db) {
      var collection = db.collection('company_supplier');
      collection.drop()
      seneca.make$('company', 'supplier_group').native$(function (err, db) {
        var collection = db.collection('company_supplier_supplier_group');
        collection.drop()
        seneca.make$('company', 'group').native$(function (err, db) {
          var collection = db.collection('company_supplier_group');
          collection.drop()
          done()
        })
      })
    })
  })

  var suppliers = []
  var supplierGroups = []

  var add_suppliers = function (done) {
    Async.map(rowsuppliers, function (item, mapNext) {
      seneca.act('role:supplier, cmd:add', item, function (err, respond) {
        mapNext(null, respond.supplier.data$())
      })
    }, function (err, results) {
      suppliers = results
      done()
    })
  }

  var add_supplier_groups = function (done) {
    Async.map(rowsupplierGroups, function (item, mapNext) {
      seneca.act('role:supplier, cmd:add-group', item, function (err, respond) {
        mapNext(null, respond.supplier_group.data$())
      })
    }, function (err, results) {
      supplierGroups = results
      done()
    })
  }

  var assign_data_group_0 = function (done) {
    seneca.act('role:supplier, cmd:assign', {
      supplier_group_id: supplierGroups[ 0 ].id,
      supplier_id: suppliers[ 0 ].id
    }, function (err, respond) {
      seneca.act('role:supplier, cmd:assign', {
        supplier_group_id: supplierGroups[ 0 ].id,
        supplier_id: suppliers[ 1 ].id
      }, function (err, respond) {
        seneca.act('role:supplier, cmd:assign', {
          supplier_group_id: supplierGroups[ 0 ].id,
          supplier_id: suppliers[ 2 ].id
        }, function (err, respond) {
          done()
        })
      })
    })
  }

  var assign_data_group_1 = function (done) {
    seneca.act('role:supplier, cmd:assign', {
      supplier_group_id: supplierGroups[ 1 ].id,
      supplier_id: suppliers[ 4 ].id
    }, function (err, respond) {
      seneca.act('role:supplier, cmd:assign', {
        supplier_group_id: supplierGroups[ 1 ].id,
        supplier_id: suppliers[ 2 ].id
      }, function (err, respond) {
        seneca.act('role:supplier, cmd:assign', {
          supplier_group_id: supplierGroups[ 1 ].id,
          supplier_id: suppliers[ 3 ].id
        }, function (err, respond) {
          done()
        })
      })
    })
  }

  before(function (done) {
    Async.waterfall([
        add_suppliers,
        add_supplier_groups,
        assign_data_group_0,
        assign_data_group_1
      ],
      done)
  })

  function get_by_group (data, callback) {
    seneca.act('role:supplier, cmd:get-by-group', data, callback)
  }

  it('can get suppliers information in supplier group', function (done) {
    get_by_group({ supplier_group_id: supplierGroups[ 1 ].id, query: { sort$: { name: 1 } } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.suppliers.length).to.equal(3)
      expect(respond.suppliers[ 0 ].data$()).to.include(suppliers[ 2 ])
      expect(respond.suppliers[ 1 ].data$()).to.include(suppliers[ 3 ])
      expect(respond.suppliers[ 2 ].data$()).to.include(suppliers[ 4 ])
      done()
    })
  })

  it('can get suppliers id in supplier group with supplier_infor is false', function (done) {
    get_by_group({ supplier_group_id: supplierGroups[ 0 ].id, supplier_info: false }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.supplierIds.length).to.equal(3)
      done()
    })
  })

  //--------------------------------------------------------------------------------------------------------------------

  it("can NOT get suppliers information in group without supplier group's id", function(done){
    get_by_group({}, function(err, respond){
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    })
  })

  it("can NOT get suppliers information in group with wrong supplier group's id" , function(done){
    var wrongsupplierGroupId = 'wrongId'
    get_by_group({supplier_group_id: wrongsupplierGroupId}, function(err, respond){
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('not-found')
      done()
    })
  })
})