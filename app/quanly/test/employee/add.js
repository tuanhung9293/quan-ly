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

describe('role:employee, cmd:add', function () {
  after(function(done) {
    seneca.make$('company', 'employee').native$(function (err, db) {
      var collection = db.collection('company_employee');
      collection.drop()
      done()
    })
  })

  function add_employee (data, callback) {
    seneca.act('role:employee, cmd:add', data, callback)
  }

  function expect_timestamp_fields_and_status(respond) {
    expect(respond.employee.created_at).to.be.exist()
    expect(respond.employee.updated_at).to.be.exist()
    expect(respond.employee.status).to.equal('active')
  }

  it('can add with perfect data', function (done) {
    var perfectData = {
      email: 'perfect@gmail.com',
      name: 'perfect-name',
      phone: '0911222333',
      address: '123 Pen.'
    }

    add_employee(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.employee.id).to.be.exist()
      expect(respond.employee).to.include(perfectData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  it('can add with missing optional data', function (done) {
    var missionOptionalData = {
      email: 'missing-email@gmail.com',
      name: 'missing-name',
      phone: '0911222322'
    }
    var expectedData = Lodash.assign({}, missionOptionalData, {
      address: ''
    })

    add_employee(missionOptionalData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.employee.id).to.be.exist()
      expect(respond.employee).to.include(expectedData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  it('can add with optional wrong type', function (done) {
    var missionOptionalData = {
      email: 'wrong-type@gmail.com',
      name: 'missing-name',
      phone: 9121232212,
    }
    var expectedData = Lodash.assign({}, missionOptionalData, {
      phone: '9121232212',
      address: ''
    })

    add_employee(missionOptionalData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.employee.id).to.be.exist()
      expect(respond.employee).to.include(expectedData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  it('can add with duplicate email, that have deleted status', function (done) {
      var perfectData = {
          email: 'perfect_deleted@gmail.com',
          name: 'perfect-deleted',
          phone: '0911222333',
          address: '123 Pen.'
      }
      add_employee(perfectData, function (err, respond) {
          seneca.act('role:employee, cmd:delete', { id: respond.employee.id }, function (err, respond) {
              add_employee(perfectData, function (err, respond) {
                  expect(err).not.exist()
                  expect(respond.ok).to.be.true()

                  expect(respond.employee.id).to.be.exist()
                  expect(respond.employee).to.include(perfectData)
                  expect_timestamp_fields_and_status(respond)

                  done()
              })
          })
      })
  })

  // --------------------------------------------------
  var invalidCallback = function (done) {
    return function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    }
  }

  it("can NOT add with missing email", function (done) {
    var missingEmailData = {
      name: 'missing-email',
      phone: '0123456789',
      address: '123 Le Loi'
    }
    add_employee(missingEmailData, invalidCallback(done))
  })

  it("can NOT add with wrong email", function (done) {
    var wrongEmailData = {
      name: 'name',
      phone: '0123456789',
      email: 'missing@',
      address: '123 Le Loi'
    }
    add_employee(wrongEmailData, invalidCallback(done))
  })

  it("can NOT add with duplicate email", function (done) {
    var duplicateEmailData = {
      email: 'duplicate-email@gmail.com',
      name: 'name',
      phone: '0123456789',
      address: '123 Le Loi'
    }
    add_employee(duplicateEmailData, function(err, respond){
      var existData = {
        email : respond.employee.email,
        name: 'ahihi',
        phone: '0978333222'
      }
      add_employee(existData, function(err, respond){
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('email-exists')
        done()
      })
    })
  })

  it("can NOT add with duplicate email,don't care UpperCase-LowerCase", function (done) {
    var duplicateCaseEmailData = {
      email: 'duplicateCaseEmail@gmail.com',
      name: 'nameCase',
      phone: '0123456789',
      address: '123 Le Loi'
    }
    add_employee(duplicateCaseEmailData, function(err, respond){
      var existCaseData = {
        email : 'DUPlicateCaseemail@Gmail.com',
        name: 'ahihi',
        phone: '0978333222'
      }
      add_employee(existCaseData, function(err, respond){
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('email-exists')
        done()
      })
    })
  })

  it("can NOT add with missing name", function (done) {
    var missingNameData = {
      email: 'missing@gmail.com',
      phone: '0123456789',
      address: '123 Le Loi'
    }
    add_employee(missingNameData, invalidCallback(done))
  })

  it("can NOT add with too short name", function (done) {
    var shortNameData = {
      email: 'missing@gmail.com',
      name: 'a',
      phone: '0123456789',
      address: '123 Le Loi'
    }
    add_employee(shortNameData, invalidCallback(done))
  })

  it("can NOT add missing phone number", function (done) {
    var shortNameData = {
      email: 'missing-phone@gmail.com',
      name: 'missing-phone',
      address: '123 Le Loi'
    }
    add_employee(shortNameData, invalidCallback(done))
  })
  
})