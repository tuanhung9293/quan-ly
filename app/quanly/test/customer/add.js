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

describe('role:customer, cmd:add', function () {
  after(function(done) {
    seneca.make$('company', 'customer').native$(function (err, db) {
      var collection = db.collection('company_customer');
      collection.drop()
      done()
    })
  })

  function add_customer (data, callback) {
    seneca.act('role:customer, cmd:add', data, callback)
  }

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.customer.created_at).to.be.exist()
    expect(respond.customer.updated_at).to.be.exist()
    expect(respond.customer.status).to.equal('active')
  }

  it('can add with perfect data', function (done) {
    var perfectData = {
      name: 'perfect-name',
      email: 'perfect@gmail.com',
      phone: '09067897789',
      address: '123 Le Loi'
    }
    add_customer(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.customer.id).to.be.exist()
      expect(respond.customer).to.include(perfectData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add with missing optional data', function (done) {
    var missingAddress = {
      name: 'missing-name',
      email: 'missing@gmail.com',
      phone: '090909090999'
    }
    var expectedData = Lodash.assign({}, missingAddress, {
      address: ''
    })
    add_customer(missingAddress, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.customer.id).to.be.exist()
      expect(respond.customer).to.include(expectedData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add with optional wrong type data', function (done) {
    var optionalWrongData = {
      name: 'missing-name',
      phone: 9090909090,
      email: 'missing@gmail.com',
    }
    var expectedData = Lodash.assign({}, optionalWrongData, {
      phone: '9090909090',
      address: ''
    })
    add_customer(optionalWrongData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.customer.id).to.be.exist()
      expect(respond.customer).to.include(expectedData)
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

  it('can NOT add a customer with missing data', function (done) {
    var missingData = {
      address: '123 Nguyen Hue'
    }
    add_customer(missingData, invalidCallback(done))
  })

  it('can NOT add a customer with email is invalid', function (done) {
    var invalidEmailData = {
      name: 'invalid-name',
      phone: '0909090909',
      email: 'invalidEmail',
      address: '123 Ho Xuan Huong'
    }
    add_customer(invalidEmailData, invalidCallback(done))
  })

  it('can NOT add a customer with too short name, phone', function (done) {
    var tooShortData = {
      name: 'a',
      phone: '9',
      email: 'tooshort@gameil.com',
      address: '123 Ho Hoan Kiem'
    }
    add_customer(tooShortData, invalidCallback(done))
  })
})