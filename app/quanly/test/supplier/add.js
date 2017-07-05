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

describe('role:supplier, cmd:add', function () {
  after(function (done) {
    seneca.make$('company', 'supplier').native$(function (err, db) {
      var collection = db.collection('company_supplier');
      collection.drop()
      done()
    })
  })
  function add_supplier (data, callback) {
    seneca.act('role:supplier, cmd:add', data, callback)
  }

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.supplier.created_at).to.be.exist()
    expect(respond.supplier.updated_at).to.be.exist()
    expect(respond.supplier.status).to.equal('active')
  }

  it('can add with perfect data', function (done) {
    var perfectData = {
      email: 'perfect@gmail.com',
      name: 'perfect-name',
      phone: '0911222333',
      address: '2 Good Doo'
    }

    add_supplier(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.supplier.id).to.be.exist()
      expect(respond.supplier).to.include(perfectData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  it('can add with wrong phone type', function (done) {
    var wrongPhoneData = {
      name: 'wrong_phone',
      email: 'wrong_phone@gmail.com',
      address: '2 Good Doo',
      phone: 911222333
    }
    var expectData = Lodash.assign({}, wrongPhoneData, { phone: '911222333' })

    add_supplier(wrongPhoneData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.supplier.id).to.be.exist()
      expect(respond.supplier).to.include(expectData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })
  //---------------------------------------------------
  var invalid_callback = function (done) {
    return function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    }
  }

  it('can NOT add with missing name', function (done) {
    var missingNameData = {
      name: 's',
      email: 'missing_name@gmail.com',
      phone: '0911222333',
      address: '2 Good Doo'
    }
    add_supplier(missingNameData, invalid_callback(done))
  })

  it("can NOT add with too short name", function (done) {
    var too_short_nameData = {
      name: 't',
      email: 'too_short_name@gmail.com',
      phone: '12345',
      address: '123 Le Loi'
    }
    add_supplier(too_short_nameData, invalid_callback(done))
  })

  it("can NOT add with missing email", function (done) {
    var missingEmailData = {
      name: 'missing-email',
      phone: '0123456789',
      address: '123 Le Loi'
    }
    add_supplier(missingEmailData, invalid_callback(done))
  })

  it("can NOT add with wrong email", function (done) {
    var wrongEmailData = {
      name: 'name',
      email: 'missing@',
      phone: '0123456789',
      address: '123 Le Loi'
    }
    add_supplier(wrongEmailData, invalid_callback(done))
  })

  it("can NOT add with missing phone", function (done) {
    var missingPhoneData = {
      name: 'missing_phone',
      email: 'missing_phone@gmail.com',
      address: '123 Le Loi'
    }
    add_supplier(missingPhoneData, invalid_callback(done))
  })

  it("can NOT add with too short phone", function (done) {
    var tooshortPhoneData = {
      name: 'too_short_phone',
      email: 'too_short_phone@gmail.com',
      phone: '12345',
      address: '123 Le Loi'
    }
    add_supplier(tooshortPhoneData, invalid_callback(done))
  })

  it("can NOT add with missing address", function (done) {
    var missingAddressData = {
      name: 'missing_address',
      email: 'missing_address@gmail.com',
      phone: '0123456789'
    }
    add_supplier(missingAddressData, invalid_callback(done))
  })
})




