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

describe('role:warehouse, cmd:add', function () {
  after(function(done) {
    seneca.make$('company', 'warehouse').native$(function (err, db) {
      var collection = db.collection('company_warehouse');
      collection.drop()
      done()
    })
  })

  function add_warehouse (data, callback) {
    seneca.act('role:warehouse, cmd:add', data, callback)
  }

  function expect_timestamp_fields_and_status(respond) {
    expect(respond.warehouse.created_at).to.be.exist()
    expect(respond.warehouse.updated_at).to.be.exist()
    expect(respond.warehouse.status).to.equal('active')
  }

  it('can add with perfect data', function (done) {
    var perfectData = {
      name: 'perfect-name',
      phone: '0911222333',
      email: 'perfect@gmail.com',
      address: '123 Pen.'
    }

    add_warehouse(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.warehouse.id).to.be.exist()
      expect(respond.warehouse).to.include(perfectData)
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

    add_warehouse(missionOptionalData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.warehouse.id).to.be.exist()
      expect(respond.warehouse).to.include(expectedData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  // case 3: optional wrong type
  it('can add with missing optional data', function (done) {
    var missionOptionalData = {
      name: 'missing-name',
      phone: 9121232212,
    }
    var expectedData = Lodash.assign({}, missionOptionalData, {
      phone: '9121232212',
      email: '',
      address: ''
    })

    add_warehouse(missionOptionalData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.warehouse.id).to.be.exist()
      expect(respond.warehouse).to.include(expectedData)
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
    add_warehouse(missingNameData, invalidCallback(done))
  })

  it("can NOT add with too short name", function (done) {
    var shortNameData = {
      name: 'a',
      phone: '0123456789',
      email: 'missing@gmail.com',
      address: '123 Le Loi'
    }
    add_warehouse(shortNameData, invalidCallback(done))
  })

  it("can NOT add with wrong email", function (done) {
    var wrongEmailData = {
      name: 'name',
      phone: '0123456789',
      email: 'missing@',
      address: '123 Le Loi'
    }
    add_warehouse(wrongEmailData, invalidCallback(done))
  })
})