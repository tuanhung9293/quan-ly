'use strict'

process.env.COMPANY = 'test'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:role, cmd:update', function () {
  after(function (done) {
    seneca.make$('access_rights', 'roles').native$(function (err, db) {
      db.collection('access_rights_roles').drop()
      done()
    })
  })

  function update_role (data, callback) {
    seneca.act('role:role, cmd:update', data, callback)
  }

  it('can update perfect data', function (done) {
    seneca.act('role:role, cmd:add', { name: 'name' }, function (err, createdRole) {
      var perfectData = {
        id: createdRole.role.id,
        name: 'perfect-name',
        alias: 'perfect-alias',
        is_default: false,
        is_removable: true,
        status: 'inactive'
      }
      update_role(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.role).to.include(perfectData)
        expect(respond.role.created_at).to.be.exist()
        expect(respond.role.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update do not touch not provided properties', function (done) {
    seneca.act('role:role, cmd:add', { name: 'role', is_admin: true }, function (err, createdRole) {
      var perfectData = {
        id: createdRole.role.id,
        alias: 'something'
      }
      update_role(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.role.name).to.equal('role')
        expect(respond.role.is_admin).to.be.true()
        expect(respond.role.created_at).to.be.exist()
        expect(respond.role.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('auto set is_removable to false if it is default role', function (done) {
    seneca.act('role:role, cmd:add', { name: 'name', is_default: false, is_removable: false }, function (err, createdRole) {
      var data = {
        id: createdRole.role.id,
        is_default: true,
      }
      update_role(data, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.role.is_removable).to.be.false()
        done()
      })
    })
  })

  // --------------------------------------------------

  it('can NOT update role without id', function (done) {
    seneca.act('role:role, cmd:add', { name: 'name' }, function (err, createdRole) {
      var idNotFoundData = {
        name: 'name',
      }
      update_role(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update role with wrong id', function (done) {
    seneca.act('role:role, cmd:add', { name: 'name' }, function (err, createdRole) {
      var idNotFoundData = {
        id: 'wrong-id',
        name: 'name',
      }
      update_role(idNotFoundData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

  it('can NOT update with too short name', function (done) {
    seneca.act('role:role, cmd:add', { name: 'name' }, function (err, createdRole) {
      var perfectData = {
        id: createdRole.role.id,
        name: '1'
      }
      update_role(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })
})