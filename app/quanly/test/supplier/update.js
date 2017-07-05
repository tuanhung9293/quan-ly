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

describe('role:supplier, cmd:update', function () {
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

  function update_supplier (data, callback) {
    seneca.act('role:supplier, cmd:update', data, callback)
  }

  it('can update a supplier with perfect data', function (done) {
    var testData1 = {
      name: 'name1',
      phone: '0980989809',
      email: 'email@gmail.com',
      address: '234 Lin Da'
    }
    add_supplier(testData1, function (err, respond) {
      var perfectData = {
        id: respond.supplier.id,
        name: 'perfect-name',
        phone: '0123456789',
        email: 'perfect@gmail.com',
        address: '123 Hai Phong',
        status: 'inactive'
      }
      update_supplier(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.supplier.id).to.be.exist()
        expect(respond.supplier).to.include(perfectData)
        expect(respond.supplier.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update a supplier with missing data', function (done) {
    var testData2 = {
      name: 'name2',
      phone: '0980989808',
      email: 'email2@gmail.com',
      address: '234 Lin Da'
    }
    add_supplier(testData2, function (err, respond) {
      var missingData = {
        id: respond.supplier.id,
        name: 'missing-name',
        phone: 112345678999
      }
      update_supplier(missingData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.supplier.id).to.be.exist()
        expect(respond.supplier.name).to.equal(missingData.name)
        expect(respond.supplier.phone).to.equal('112345678999')
        expect(respond.supplier.updated_at).to.be.exist()
        done()
      })
    })
  })

  //----------------------------------------------------------------------------------------------------------

  var invalid_callback = function (done) {
    return function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    }
  }

  it('can NOT update a supplier with too short name', function (done) {
    var testData3 = {
      name: 'name4',
      phone: '010100101010',
      email: 'email4@gmail.com',
      address: '21 Quang Tue'
    }
    add_supplier(testData3, function (err, respond) {
      var tooshortNameData = {
        id: respond.supplier.id,
        name: 'a',
        phone: '1234567'
      }
      update_supplier(tooshortNameData, invalid_callback(done))
    })
  })

  it('can NOT update a supplier with invalid email', function (done) {
    var testData5 = {
      name: 'name3',
      phone: '09809898232',
      email: 'email3@gmail.com',
      address: '21 Quang Tue'
    }
    add_supplier(testData5, function (err, respond) {
      var invalidEmailData = {
        id: respond.supplier.id,
        email: 'invalidEmail'
      }
      update_supplier(invalidEmailData, invalid_callback(done))
    })
  })

  it('can NOT update a supplier with too short phone', function (done) {
    var testData6 = {
      name: 'phone4',
      phone: '010100101010',
      email: 'email4@gmail.com',
      address: '21 Quang Tue'
    }
    add_supplier(testData6, function (err, respond) {
      var tooshortPhoneData = {
        id: respond.supplier.id,
        name: 'too_shortName',
        phone: '12345'
      }
      update_supplier(tooshortPhoneData, invalid_callback(done))
    })
  })

  it('can NOT update a supplier with invalid status', function (done) {
    var testData7 = {
      name: 'name5',
      phone: '012839291033',
      email: 'email5@gmail.com',
      address: '21 Quang Tue'
    }
    add_supplier(testData7, function (err, respond) {
      var invalidStatusData = {
        id: respond.supplier.id,
        status: 'deleted'
      }
      update_supplier(invalidStatusData, invalid_callback(done))
    })
  })

  it('can NOT update a supplier with undefined id', function (done) {
    var testData8 = {
      name: 'name6',
      phone: '012839291233',
      email: 'email6@gmail.com',
      address: '44 Phan Chaau Trinh'
    }
    add_supplier(testData8, function (err, respond) {
      var undefinedIDData = {
        name: 'invalid-name',
        phone: '01202020202',
        email: 'invalid@gmail.com',
        address: '123 Hoang Dieu'
      }
      update_supplier(undefinedIDData, invalid_callback(done))
    })
  })

  it('can NOT update a supplier with invalid id', function (done) {
    var testData9 = {
      name: 'name7',
      phone: '0128392911',
      email: 'email7@gmail.com',
      address: '30 Ly Thai To'
    }
    add_supplier(testData9, function (err, respond) {
      var invalidIDData = {
        id: 'invalid-id',
        name: 'invalid-name',
        phone: '01202020202',
        email: 'invalid@gmail.com',
        address: '123 Hoang Dieu'
      }
      update_supplier(invalidIDData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })
})