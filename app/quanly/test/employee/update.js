'use strict'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const seneca = require('../seneca')
const Constants = require('../../packages/employee/lib/constants')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:employee, cmd:update', function () {
  after(function (done) {
    seneca.make$('company', 'employee').native$(function (err, db) {
      var collection = db.collection('company_employee');
      collection.drop()
      done()
    })
  })

  function update_employee (data, callback) {
    seneca.act('role:employee, cmd:update', data, callback)
  }

  function add_employee (data, callback) {
    seneca.act('role:employee, cmd:add', data, callback)
  }

  it('can update perfect data', function (done) {
    add_employee({ email: 'email@gmail.com', name: 'name', phone: '0978099888' }, function (err, createdemployee) {
      var perfectData = {
        id: createdemployee.employee.id,
        email: 'perfect@gmail.com',
        name: 'perfect-name',
        phone: '0911222333',
        address: '123 Pen.',
        status: 'inactive'
      }
      update_employee(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.employee).to.include(perfectData)
        expect(respond.employee.created_at).to.be.exist()
        expect(respond.employee.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update do not touch not provided properties', function (done) {
    add_employee({
      email: 'provided@gmail.com',
      name: 'name',
      phone: '0978099888',
      address: 'abc'
    }, function (err, createdemployee) {
      var perfectData = {
        id: createdemployee.employee.id,
      }
      update_employee(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.employee.email).to.equal('provided@gmail.com')
        expect(respond.employee.name).to.equal('name')
        expect(respond.employee.address).to.equal('abc')
        expect(respond.employee.created_at).to.be.exist()
        expect(respond.employee.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update with duplicate email, that NOT have STATUS_ACTIVE', function (done) {
    add_employee({
      email: 'duplicateemail12@gmail.com',
      name: 'name',
      phone: '0978088555',
      status: Constants.STATUS_DELETED
    }, function (err, respond_123) {
      var existData = {
        email: 'duplicateemail12@gmail.com',
        name: 'duplicate'
      }
      add_employee({
        email: 'randomemail12@gmail.com',
        name: 'random',
        phone: '0978088555'
      }, function (err, createdemployee) {
        var duplicateData = Lodash.assign({}, { id: createdemployee.employee.id }, existData)
        update_employee(duplicateData, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()

          expect(respond.employee.email).to.equal('duplicateemail12@gmail.com')
          expect(respond.employee.name).to.equal('duplicate')
          expect(respond.employee.phone).to.equal('0978088555')
          expect(respond.employee.created_at).to.be.exist()
          expect(respond.employee.updated_at).to.be.exist()
          done()
        })
      })
    })
  })
  // // --------------------------------------------------

  it('can NOT update employee without id', function (done) {
    add_employee({ email: 'withoutID@gmail.com', name: 'name', phone: '0978099777' }, function (err, createdemployee) {
      var idNotFoundData = {
        email: 'withoutID@gmail.com',
        name: 'name',
      }
      update_employee(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update employee with wrong id', function (done) {
    add_employee({ email: 'wrongID@gmail.com', name: 'name', phone: '0978099888' }, function (err, createdemployee) {
      var idNotFoundData = {
        id: 'wrong-id',
        email: 'wrongID@gmail.com',
        name: 'name',
      }
      update_employee(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

  it('can NOT update with too short name', function (done) {
    add_employee({
      email: 'tooshortNAME@gmail.com',
      name: 'name',
      phone: '0978444333'
    }, function (err, createdemployee) {
      var perfectData = {
        id: createdemployee.employee.id,
        email: 'tooshortNAME@gmail.com',
        name: '1'
      }
      update_employee(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update with wrong email', function (done) {
    add_employee({ email: 'wrongEMAIL@gmail.com', name: 'name', phone: '0978444333' }, function (err, createdemployee) {
      var perfectData = {
        id: createdemployee.employee.id,
        email: 'wrong@',
      }
      update_employee(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update with duplicate email', function (done) {
    add_employee({ email: 'duplicateEMAIL@gmail.com', name: 'name', phone: '0978088555' }, function (err, respond) {
      var existData = {
        email: respond.employee.email,
        name: respond.employee.name
      }
      add_employee({ email: 'random@gmail.com', name: 'random', phone: '0978088555' }, function (err, createdemployee) {

        var duplicateData = Lodash.assign({}, { id: createdemployee.employee.id }, existData)

        update_employee(duplicateData, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.false()
          expect(respond.why).to.equal('email-exists')
          done()
        })
      })
    })
  })

  it('can NOT update with duplicate email, dont care UpperCase LowerCase', function (done) {
    add_employee({ email: 'duplicateEMAIL123@gmail.com', name: 'name', phone: '0978088555' }, function (err, respond) {
      var existData = {
        email: 'DuplicATEemail123@GMAIL.com',
        name: 'duplicate',
      }
      add_employee({
        email: 'randomemail@gmail.com',
        name: 'random',
        phone: '0978088555'
      }, function (err, createdemployee) {

        var duplicateData = Lodash.assign({}, { id: createdemployee.employee.id }, existData)

        update_employee(duplicateData, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.false()
          expect(respond.why).to.equal('email-exists')
          done()
        })
      })
    })
  })

})