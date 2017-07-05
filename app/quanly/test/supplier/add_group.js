'use strict'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const after = lab.after
const it = lab.it

describe('role:supplier, cmd:add-group', function () {
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

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.supplier_group.created_at).to.be.exist()
    expect(respond.supplier_group.updated_at).to.be.exist()
    expect(respond.supplier_group.status).to.equal('active')
  }

  it('can add with perfect data', function (done) {
    var perfectData = {
      name: 'perfect-name'
    }
    add_supplier_group(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.supplier_group.id).to.be.exist()
      expect(respond.supplier_group).to.include(perfectData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  //-------------------------------------------------------------------------------------------------

  var invalidCallback = function (done) {
    return function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    }
  }

  it('can NOT add a supplier group with missing data', function (done) {
    var missingData = {}
    add_supplier_group(missingData, invalidCallback(done))
  })

  it('can NOT add a supplier group with too short name', function (done) {
    var tooShortData = { name: 'a' }
    add_supplier_group(tooShortData, invalidCallback(done))
  })
})