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

describe('role:customer, cmd:add-group', function () {
  after(function(done) {
    seneca.make$('company', 'customer_group').native$(function (err, db) {
      var collection = db.collection('company_customer_group');
      collection.drop()
      done()
    })
  })

  function add_customer_group (data, callback) {
    seneca.act('role:customer, cmd:add-group', data, callback)
  }

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.customer_group.created_at).to.be.exist()
    expect(respond.customer_group.updated_at).to.be.exist()
    expect(respond.customer_group.status).to.equal('active')
  }

  it('can add with perfect data', function (done) {
    var perfectData = {
      name: 'perfect-name'
    }
    add_customer_group(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.customer_group.id).to.be.exist()
      expect(respond.customer_group).to.include(perfectData)
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

  it('can NOT add a customer group with missing data', function (done) {
    var missingData = {}
    add_customer_group(missingData, invalidCallback(done))
  })

  it('can NOT add a customer group with too short name', function (done) {
    var tooShortData = { name: 'a' }
    add_customer_group(tooShortData, invalidCallback(done))
  })
})