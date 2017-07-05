'use strict'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:company, cmd:add', function () {
  after(function (done) {
    seneca.make$(undefined,'companies').native$(function (err, db) {
      var collection = db.collection('companies');
      collection.drop()
      done()
    })
  })

  function add_company (data, callback) {
    seneca.act('role:company, cmd:add', data, callback)
  }

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.company.created_at).to.be.exist()
    expect(respond.company.updated_at).to.be.exist()
    expect(respond.company.status).to.equal('active')
  }

  it('can add with perfect data', function (done) {
    var perfectData = {
      hostname: 'quan-ly.com',
      full_name: 'Công ty TNHH MonKira',
      short_name: 'MonKira',
      brand_name: 'MonKira',
      address: 'N11A Trần Quý Kiên, Cầu Giấy, Hà Nội',
      phone:'0934782003'
    }
    add_company(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.company.id).to.be.exist()
      expect(respond.company).to.include(perfectData)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  it('can add with missing optional data', function (done) {
    var missionOptionalData = {
      hostname: 'quan-ly.vn',
      full_name: 'Công ty TNHH ABC',
    }

    add_company(missionOptionalData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.company.id).to.be.exist()
      expect(respond.company.hostname).to.include(missionOptionalData.hostname)
      expect(respond.company.full_name).to.include(missionOptionalData.full_name)
      expect_timestamp_fields_and_status(respond)

      done()
    })
  })

  // --------------------------------------------------
  var invalid_callback = function (done) {
    return function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    }
  }

  it("can NOT add with missing hostname", function (done) {
    var missingHostnameData = {
      full_name: 'Công ty TNHH ABCD',
      short_name: 'ABCD',
      brand_name: 'ABCD',
      address: 'Cầu Giấy, Hà Nội',
      phone:'0934782002'
    }
    add_company(missingHostnameData, invalid_callback(done))
  })

  it("can NOT add with too short hostname", function (done) {
    var shortHostnameData = {
      hostname: 'q',
      full_name: 'Công ty TNHH SHBC',
      short_name: 'SHBC',
      brand_name: 'SHBC',
      address: 'Cầu Giấy, Hà Nội',
      phone:'0934782004'
    }
    add_company(shortHostnameData, invalid_callback(done))
  })

  it("can NOT add with missing full_name", function (done) {
    var missingFullnameData = {
      hostname: 'quan-ly.org',
      short_name: 'ABCD',
      brand_name: 'ABCD',
      address: 'Cầu Giấy, Hà Nội',
      phone:'0934782005'
    }
    add_company(missingFullnameData, invalid_callback(done))
  })

  it("can NOT add with too short full_name", function (done) {
    var shortFullNameData = {
      hostname: 'quan-ly.net',
      full_name: 'C',
      short_name: 'SHBC',
      brand_name: 'SHBC',
      address: 'Cầu Giấy, Hà Nội',
      phone:'0934782006'
    }
    add_company(shortFullNameData, invalid_callback(done))
  })

  it("can NOT add with wrong status", function (done) {
    var wrongStatusData = {
      hostname: 'quan-ly.net',
      full_name: 'C',
      short_name: 'SHBC',
      brand_name: 'SHBC',
      address: 'Cầu Giấy, Hà Nội',
      phone:'0934782007',
      status: 'deleted'
    }
    add_company(wrongStatusData, invalid_callback(done))
  })

  it("can NOT add with company is existing", function (done) {
    var companyExistingData = {
      hostname: 'quan-ly.com',
      full_name: 'Công ty TNHH MonKira',
      short_name: 'MonKira',
      brand_name: 'MonKira',
      address: 'N11A Trần Quý Kiên, Cầu Giấy, Hà Nội',
      phone:'0934782003'
    }
    add_company(companyExistingData, function(err, respond){
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('company-existing')
      done()
    })
  })
})