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

describe('role:supplier, cmd:delete', function () {
  after(function (done) {
    seneca.make$('company', 'supplier').native$(function (err, db) {
      var collection = db.collection('company_supplier');
      collection.drop()
      done()
    })
  })
  function delete_supplier (data, callback) {
    seneca.act('role:supplier, cmd:delete', data, callback)
  }

  function add_supplier (data, callback) {
    seneca.act('role:supplier, cmd:add', data, callback)
  }

  it('can delete with correct id', function (done) {
    add_supplier({
      name: 'correct_id',
      email: 'delete@gmail.com',
      phone: '0978333222',
      address: '23 Miani'
    }, function (err, createdsupplier) {
      var id = createdsupplier.supplier.id
      delete_supplier({ id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.supplier.status).to.equal('deleted')
        expect(respond.supplier.updated_at).to.be.exist()
        done()
      })
    })
  })

  //-------------------------------------------------------------
  it('can NOT delete supplier without id', function (done) {
    add_supplier({
      emaname: 'without_id',
      il: 'withoutID@gmail.com',
      phone: '0978333222',
      address: '23 Miani'
    }, function (err, createdsupplier) {
      delete_supplier({}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT delete supplier with wrong id', function (done) {
    add_supplier({
      name: 'wrong_id',
      mail: 'wrongID@gmail.com',
      phone: '0978333222',
      address: '23 Miani'
    }, function (err, createdsupplier) {
      var idNotFoundData = {
        id: 'wrong-id'
      }
      delete_supplier(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

})