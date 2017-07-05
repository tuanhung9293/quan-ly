'use strict'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:supplier, cmd:update-group', function () {
  after(function (done) {
    seneca.make$('company', 'supplier_group').native$(function (err, db) {
      var collection = db.collection('company_supplier_group');
      collection.drop()
      done()
    })
  })

  function add_supplier_group (data, callback) {
    seneca.act('role:supplier, cmd:add-group', data, callback)
  }

  function update_supplier_group (data, callback) {
    seneca.act('role:supplier, cmd:update-group', data, callback)
  }

  it('can update a supplier group with perfect data', function (done) {
    var testData1 = { name: 'name1' }
    add_supplier_group(testData1, function (err, respond) {
      var perfectData = {
        id: respond.supplier_group.id,
        name: 'perfect-name',
        status: 'inactive'
      }
      update_supplier_group(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.supplier_group.id).to.be.exist()
        expect(respond.supplier_group).to.include(perfectData)
        expect(respond.supplier_group.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update a supplier group with missing data', function (done) {
    var testData2 = { name: 'name2' }
    add_supplier_group(testData2, function (err, respond) {
      var missingData = {
        id: respond.supplier_group.id,
        name: 'missing-name'
      }
      update_supplier_group(missingData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.supplier_group.id).to.be.exist()
        expect(respond.supplier_group.name).to.equal(missingData.name)
        expect(respond.supplier_group.updated_at).to.be.exist()
        done()
      })
    })
  })

  //----------------------------------------------------------------------------------------------------------

  var invalidCallback = function (done) {
    return function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    }
  }

  it('can NOT update a supplier group with too short name', function (done) {
    var testData3 = { name: 'name3' }
    add_supplier_group(testData3, function (err, respond) {
      var tooShortData = {
        id: respond.supplier_group.id,
        name: 'a'
      }
      update_supplier_group(tooShortData, invalidCallback(done))
    })
  })

  it('can NOT update a supplier group with invalid status', function (done) {
    var testData4 = { name: 'name4' }
    add_supplier_group(testData4, function (err, respond) {
      var invalidStatusData = {
        id: respond.supplier_group.id,
        status: 'deleted'
      }
      update_supplier_group(invalidStatusData, invalidCallback(done))
    })
  })

  it('can NOT update a supplier group with undefined id', function (done) {
    var testData5 = { name: 'name5' }
    add_supplier_group(testData5, function (err, respond) {
      var undefinedIDData = {
        name: 'invalid-name',
        status: 'inactive'
      }
      update_supplier_group(undefinedIDData, invalidCallback(done))
    })
  })

  it('can NOT update a supplier group with invalid id', function (done) {
    var testData6 = { name: 'name6' }
    add_supplier_group(testData6, function (err, respond) {
      var invalidIDData = {
        id: 'invalid-id',
        name: 'invalid-name',
        status: 'inactive'
      }
      update_supplier_group(invalidIDData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })
})