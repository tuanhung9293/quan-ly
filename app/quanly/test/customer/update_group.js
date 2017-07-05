'use strict'

process.env.COMPANY = 'default'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:customer, cmd:edit-group', function () {
  after(function (done) {
    seneca.make$('company', 'customer_group').native$(function (err, db) {
      var collection = db.collection('company_customer_group');
      collection.drop()
      done()
    })
  })

  function add_customer_group (data, callback) {
    seneca.act('role:customer, cmd:add-group', data, callback)
  }

  function edit_customer_group (data, callback) {
    seneca.act('role:customer, cmd:edit-group', data, callback)
  }

  it('can edit a customer group with perfect data', function (done) {
    var testData1 = { name: 'name1' }
    add_customer_group(testData1, function (err, respond) {
      var perfectData = {
        id: respond.customer_group.id,
        name: 'perfect-name',
        status: 'inactive'
      }
      edit_customer_group(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.customer_group.id).to.be.exist()
        expect(respond.customer_group).to.include(perfectData)
        expect(respond.customer_group.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can edit a customer group with missing data', function (done) {
    var testData2 = { name: 'name2' }
    add_customer_group(testData2, function (err, respond) {
      var missingData = {
        id: respond.customer_group.id,
        name: 'missing-name'
      }
      edit_customer_group(missingData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.customer_group.id).to.be.exist()
        expect(respond.customer_group.name).to.equal(missingData.name)
        expect(respond.customer_group.updated_at).to.be.exist()
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

  it('can NOT edit a customer group with too short name', function (done) {
    var testData3 = { name: 'name3' }
    add_customer_group(testData3, function (err, respond) {
      var tooShortData = {
        id: respond.customer_group.id,
        name: 'a'
      }
      edit_customer_group(tooShortData, invalidCallback(done))
    })
  })

  it('can NOT edit a customer group with invalid status', function (done) {
    var testData4 = { name: 'name4' }
    add_customer_group(testData4, function (err, respond) {
      var invalidStatusData = {
        id: respond.customer_group.id,
        status: 'deleted'
      }
      edit_customer_group(invalidStatusData, invalidCallback(done))
    })
  })

  it('can NOT edit a customer group with undefined id', function (done) {
    var testData5 = { name: 'name5' }
    add_customer_group(testData5, function (err, respond) {
      var undefinedIDData = {
        name: 'invalid-name',
        status: 'inactive'
      }
      edit_customer_group(undefinedIDData, invalidCallback(done))
    })
  })

  it('can NOT edit a customer group with invalid id', function (done) {
    var testData6 = { name: 'name6' }
    add_customer_group(testData6, function (err, respond) {
      var invalidIDData = {
        id: 'invalid-id',
        name: 'invalid-name',
        status: 'inactive'
      }
      edit_customer_group(invalidIDData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })
})