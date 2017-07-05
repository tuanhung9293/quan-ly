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

describe('role:retail, cmd:add', function () {
  after(function (done) {
    seneca.make$('company', 'retail').native$(function (err, db) {
      var collection = db.collection('company_retail');
      collection.drop()
      done()
    })
  })

  function add_retail (data, callback) {
    seneca.act('role:retail, cmd:add', data, callback)
  }

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.retail.created_at).to.be.exist()
    expect(respond.retail.updated_at).to.be.exist()
    expect(respond.retail.status).to.equal('active')
  }

  it('can add with perfect data', function (done) {
    var perfectData = {
      name: 'perfect-name',
      phone: '0911222333',
      email: 'perfect@gmail.com',
      address: '123 Pen.'
    }

    add_retail(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.retail.id).to.be.exist()
      expect(respond.retail).to.include(perfectData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  it('can add with missing optional data', function (done) {
    var missionOptionalData = {
      name: 'missing-name'
    }
    var expectedData = Lodash.assign({}, missionOptionalData, {
      phone: '',
      email: '',
      address: ''
    })

    add_retail(missionOptionalData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.retail.id).to.be.exist()
      expect(respond.retail).to.include(expectedData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  it('can add with wrong type phone', function (done) {
    var wrongTypePhone = {
      name: 'missing-name',
      phone: 9121232212,
    }
    var expectedData = Lodash.assign({}, wrongTypePhone, {
      phone: '9121232212',
      email: '',
      address: ''
    })

    add_retail(wrongTypePhone, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.retail.id).to.be.exist()
      expect(respond.retail).to.include(expectedData)
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
      phone: '0123456789',
      email: 'missing@gmail.com',
      address: '123 Le Loi'
    }
    add_retail(missingNameData, invalidCallback(done))
  })

  it("can NOT add with too short name", function (done) {
    var shortNameData = {
      name: 'a',
      phone: '0123456789',
      email: 'missing@gmail.com',
      address: '123 Le Loi'
    }
    add_retail(shortNameData, invalidCallback(done))
  })

  it("can NOT add with wrong email", function (done) {
    var wrongEmailData = {
      name: 'name',
      phone: '0123456789',
      email: 'missing@',
      address: '123 Le Loi'
    }
    add_retail(wrongEmailData, invalidCallback(done))
  })
})