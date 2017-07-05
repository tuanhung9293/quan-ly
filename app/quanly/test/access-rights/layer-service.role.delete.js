'use strict'

process.env.COMPANY = 'test'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const before = lab.before
const after = lab.after

describe('role:role, cmd:delete, layer:service', function () {
  var defaultAdministratorRole = null
  before(function (done) {
    seneca.act('role:role, cmd:add', { name: 'default', is_admin: true }, function (args, respond) {
      defaultAdministratorRole = respond.role
      done()
    })
  })

  after(function (done) {
    seneca.make$('company', 'role').native$(function (err, db) {
      db.collection('access_rights_roles').drop()
      db.collection('logs').drop()
      done()
    })
  })

  function delete_role (data, callback) {
    data.user = { id: 'fake' }
    seneca.act('role:role, cmd:delete, layer:service', data, callback)
  }

  it('can delete with correct id', function (done) {
    seneca.act('role:role, cmd:add', { name: 'name' }, function (err, createdRole) {
      var id = createdRole.role.id
      delete_role({ id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.role.status).to.equal('deleted')
        expect(respond.log).to.exist()
        done()
      })
    })
  })

  it('can delete administrator role', function (done) {
    seneca.act('role:role, cmd:add', { name: 'another admin', is_admin: true }, function (err, createdRole) {
      var id = createdRole.role.id
      delete_role({ id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.role.status).to.equal('deleted')
        expect(respond.log).to.exist()
        done()
      })
    })
  })

  it('can NOT update role with wrong id', function (done) {
    seneca.act('role:role, cmd:add', { name: 'name' }, function (err, createdRole) {
      var idNotFoundData = {
        id: '000000000000000000000000'
      }
      delete_role(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

  it('can NOT delete ONLY Administrator left', function (done) {
    delete_role({ id: defaultAdministratorRole.id }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('no-administrator-role-left')
      done()
    })
  })
})
