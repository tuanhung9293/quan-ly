'use strict'

process.env.COMPANY = 'test'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:role, cmd:restore', function () {
  after(function (done) {
    seneca.make$('access_rights', 'roles').native$(function (err, db) {
      db.collection('access_rights_roles').drop()
      done()
    })
  })

  function restore_role (data, callback) {
    seneca.act('role:role, cmd:restore', data, callback)
  }

  it('can restore with correct id', function (done) {
    seneca.act('role:role, cmd:add', { name: 'name' }, function (err, createdRole) {
      var id = createdRole.role.id
      restore_role({ id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.role.status).to.equal('active')
        done()
      })
    })
  })

  it('can NOT restore role without id', function (done) {
    seneca.act('role:role, cmd:add', { name: 'name' }, function (err, createdRole) {
      restore_role({}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT restore role with wrong id', function (done) {
    seneca.act('role:role, cmd:add', { name: 'name' }, function (err, createdRole) {
      var idNotFoundData = {
        id: 'wrong-id'
      }
      restore_role(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

})