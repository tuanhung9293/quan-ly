'use strict'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const after = lab.after
const it = lab.it

describe('role:supplier, cmd:delete-group', function () {
  after(function (done) {
    seneca.make$('company', 'supplier_group').native$(function (err, db) {
      var collection = db.collection('company_supplier_group');
      collection.drop()
      done()
    })
  })

  function add_supplier_group (data, callback) {
    seneca.act('role:supplier, cmd: add-group', data, callback)
  }

  function delete_supplier_group (data, callback) {
    seneca.act('role:supplier, cmd: delete-group', data, callback)
  }

  it('can delete with correct id', function (done) {
    add_supplier_group({ name: 'name1' }, function (err, respond) {
      var id = respond.supplier_group.id
      delete_supplier_group({ id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.supplier_group.status).to.equal('deleted')
        expect(respond.supplier_group.updated_at).to.be.exist()
        done()
      })
    })
  })

  //---------------------------------------------------------------------------------------------------------

  it('can NOT delete supplier group without id', function (done) {
    add_supplier_group({ name: 'name2' }, function (err, respond) {
      delete_supplier_group({}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT delete supplier group with wrong id', function (done) {
    add_supplier_group({ name: 'name3' }, function (err, respond) {
      var id = 'invalid-id'
      delete_supplier_group({ id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

})