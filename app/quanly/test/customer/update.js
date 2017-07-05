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

describe('role:customer, cmd:update', function () {
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

  function update_customer (data, callback) {
    seneca.act('role:customer, cmd:update', data, callback)
  }

  it('can update a customer with perfect data', function (done) {
    var testData1 = { name: 'name1', phone: '0980989809', email: 'email@gmail.com' }
    add_customer(testData1, function (err, respond) {
      var perfectData = {
        id: respond.customer.id,
        name: 'perfect-name',
        phone: '0123456789',
        email: 'perfect@gmail.com',
        address: '123 Hai Phong',
        status: 'inactive'
      }
      update_customer(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.customer.id).to.be.exist()
        expect(respond.customer).to.include(perfectData)
        expect(respond.customer.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update a customer with missing data', function (done) {
    var testData2 = { name: 'name2', phone: '0980989808', email: 'email2@gmail.com' }
    add_customer(testData2, function (err, respond) {
      var missingData = {
        id: respond.customer.id,
        name: 'missing-name',
        phone: 112345678999
      }
      update_customer(missingData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.customer.id).to.be.exist()
        expect(respond.customer.name).to.equal(missingData.name)
        expect(respond.customer.phone).to.equal('112345678999')
        expect(respond.customer.updated_at).to.be.exist()
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

  it('can NOT update a customer with invalid email', function (done) {
    var testData3 = { name: 'name3', phone: '09809898232', email: 'email3@gmail.com' }
    add_customer(testData3, function (err, respond) {
      var invalidEmailData = {
        id: respond.customer.id,
        email: 'invalidEmail'
      }
      update_customer(invalidEmailData, invalidCallback(done))
    })
  })

  it('can NOT update a customer with too short name, phone', function (done) {
    var testData4 = { name: 'name4', phone: '010100101010', email: 'email4@gmail.com' }
    add_customer(testData4, function (err, respond) {
      var tooShortData = {
        id: respond.customer.id,
        name: 'a',
        phone: '1'
      }
      update_customer(tooShortData, invalidCallback(done))
    })
  })

  it('can NOT update a customer with invalid status', function (done) {
    var testData5 = { name: 'name5', phone: '012839291033', email: 'email5@gmail.com' }
    add_customer(testData5, function (err, respond) {
      var invalidStatusData = {
        id: respond.customer.id,
        status: 'deleted'
      }
      update_customer(invalidStatusData, invalidCallback(done))
    })
  })

  it('can NOT update a customer with undefined id', function (done) {
    var testData6 = { name: 'name6', phone: '012839291233', email: 'email6@gmail.com' }
    add_customer(testData6, function (err, respond) {
      var undefinedIDData = {
        name: 'invalid-name',
        phone: '01202020202',
        email: 'invalid@gmail.com',
        address: '123 Hoang Dieu'
      }
      update_customer(undefinedIDData, invalidCallback(done))
    })
  })

  it('can NOT update a customer with invalid id', function (done) {
    var testData7 = { name: 'name7', phone: '0128392911', email: 'email7@gmail.com' }
    add_customer(testData7, function (err, respond) {
      var invalidIDData = {
        id: 'invalid-id',
        name: 'invalid-name',
        phone: '01202020202',
        email: 'invalid@gmail.com',
        address: '123 Hoang Dieu'
      }
      update_customer(invalidIDData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })
})