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

describe('role:supplier, cmd:get-by-supplier', function () {
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

  var assign_data_0 = function (done) {
    seneca.act('role:supplier, cmd:assign', {
      supplier_group_id: supplierGroups[ 2 ].id,
      supplier_id: suppliers[ 1 ].id
    }, function (err, respond) {
      seneca.act('role:supplier, cmd:assign', {
        supplier_group_id: supplierGroups[ 0 ].id,
        supplier_id: suppliers[ 1 ].id
      }, function (err, respond) {
        seneca.act('role:supplier, cmd:assign', {
          supplier_group_id: supplierGroups[ 3 ].id,
          supplier_id: suppliers[ 1 ].id
        }, function (err, respond) {
          done()
        })
      })
    })
  }

  var assign_data_1 = function (done) {
    seneca.act('role:supplier, cmd:assign', {
      supplier_group_id: supplierGroups[ 4 ].id,
      supplier_id: suppliers[ 2 ].id
    }, function (err, respond) {
      seneca.act('role:supplier, cmd:assign', {
        supplier_group_id: supplierGroups[ 2 ].id,
        supplier_id: suppliers[ 2 ].id
      }, function (err, respond) {
        seneca.act('role:supplier, cmd:assign', {
          supplier_group_id: supplierGroups[ 3 ].id,
          supplier_id: suppliers[ 2 ].id
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
        assign_data_0,
        assign_data_1
      ],
      done)
  })

  function get_by_supplier (data, callback) {
    seneca.act('role:supplier, cmd:get-by-supplier', data, callback)
  }

  it('can get supplier groups information by supplier', function (done) {
    get_by_supplier({ supplier_id: suppliers[ 1 ].id, query: { sort$: { name: 1 } } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.supplier_groups.length).to.equal(3)
      expect(respond.supplier_groups[ 0 ].data$()).to.include(supplierGroups[ 0 ])
      expect(respond.supplier_groups[ 1 ].data$()).to.include(supplierGroups[ 2 ])
      expect(respond.supplier_groups[ 2 ].data$()).to.include(supplierGroups[ 3 ])
      done()
    })
  })

  it('can get supplier groups id by supplier with supplier_group_infor is false', function (done) {
    get_by_supplier({ supplier_id: suppliers[ 2 ].id, supplier_group_info: false }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.supplierGroupIds.length).to.equal(3)
      done()
    })
  })

  //--------------------------------------------------------------------------------------------------------------------

  it("can NOT get supplier groups information by supplier without supplier's id", function (done) {
    get_by_supplier({}, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    })
  })

  it("can NOT get supplier groups information by supplier with wrong supplier's id", function (done) {
    var wrongsupplierId = 'wrongId'
    get_by_supplier({ supplier_id: wrongsupplierId }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('not-found')
      done()
    })
  })
})