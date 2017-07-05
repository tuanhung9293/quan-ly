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

describe('role:employee, cmd:delete', function () {
  after(function(done) {
    seneca.make$('company', 'employee').native$(function (err, db) {
      var collection = db.collection('company_employee');
      collection.drop()
      done()
    })
  })

  function delete_employee (data, callback) {
    seneca.act('role:employee, cmd:delete', data, callback)
  }

  it('can delete with correct id', function (done) {
    seneca.act('role:employee, cmd:add', { email: 'delete@gmail.com', name: 'name', phone: '0978333222' }, function (err, createdemployee) {
      var id = createdemployee.employee.id
      delete_employee({ id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.employee.status).to.equal('deleted')
        expect(respond.employee.deleted_at).to.be.exist()
        done()
      })
    })
  })

  it('can NOT delete employee without id', function (done) {
    seneca.act('role:employee, cmd:add', { email: 'withoutID@gmail.com', name: 'name', phone: '0978333222' }, function (err, createdemployee) {
      delete_employee({}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT delete employee with wrong id', function (done) {
    seneca.act('role:employee, cmd:add', { email: 'wrongID@gmail.com', name: 'name', phone: '0978333222' }, function (err, createdemployee) {
      var idNotFoundData = {
        id: 'wrong-id'
      }
      delete_employee(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

})