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

describe('role:role, cmd:add', function () {
  after(function (done) {
    seneca.make$('access_rights', 'roles').native$(function (err, db) {
      db.collection('access_rights_roles').drop()
      done()
    })
  })

  function add_role (data, callback) {
    seneca.act('role:role, cmd:add', data, callback)
  }

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.role.created_at).to.be.exist()
    expect(respond.role.updated_at).to.be.exist()
    expect(respond.role.status).to.equal('active')
  }

  it('can add with perfect data', function (done) {
    var perfectData = {
      name: 'All employees',
      is_default: true
    }
    add_role(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.role.id).to.be.exist()
      expect(respond.role).to.include(perfectData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add with missing optional data', function (done) {
    var missionOptionalData = {
      name: 'missing-name'
    }
    var expectedData = Lodash.assign({}, missionOptionalData, {
      is_admin: false,
      is_default: false,
      is_removable: true,
    })

    add_role(missionOptionalData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.role.id).to.be.exist()
      expect(respond.role).to.include(expectedData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  it('auto sets is_removable to false if it is default role', function (done) {
    var missionOptionalData = {
      name: 'New role',
      is_default: true,
      is_removable: true,
    }
    add_role(missionOptionalData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.role.id).to.be.exist()
      expect(respond.role.is_default).to.be.true()
      expect(respond.role.is_removable).to.be.false()
      expect_timestamp_fields_and_status(respond)

      done()
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

  it("can NOT add with missing name", function (done) {
    var missingNameData = {
      alias: 'all-employees',
    }
    add_role(missingNameData, invalidCallback(done))
  })

  it("can NOT add with too short name", function (done) {
    var shortNameData = {
      name: 'a',
    }
    add_role(shortNameData, invalidCallback(done))
  })
})