'use strict'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:company, cmd:update', function () {
  after(function (done) {
    seneca.make$(undefined, 'companies').native$(function (err, db) {
      var collection = db.collection('companies');
      collection.drop()
      done()
    })
  })

  function update_company (data, callback) {
    seneca.act('role:company, cmd:update', data, callback)
  }

  function add_company (data, callback) {
    seneca.act('role:company, cmd:add', data, callback)
  }

  it('can update perfect data', function (done) {
    var testData = {
      hostname: 'quan-ly.com',
      full_name: 'Công ty TNHH MonKira',
      short_name: 'MonKira',
      brand_name: 'MonKira',
      address: 'N11A Trần Quý Kiên, Cầu Giấy, Hà Nội',
      phone: '0934782003'
    }
    add_company(testData, function (err, respond) {
      var perfectData = {
        id: respond.company.id,
        hostname: 'quan-ly.info',
        full_name: 'Công ty TNHH một thành viên Sông Đà',
        short_name: 'Sông Đà',
        brand_name: 'Sông Đà',
        address: 'Cầu Giấy, Hà Nội',
        phone: '0934782190',
        status: 'inactive'
      }
      update_company(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.company).to.include(perfectData)
        expect(respond.company.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update with missing optional data', function (done) {
    var testData = {
      hostname: 'quan-ly.net',
      full_name: 'Công ty TNHH Kira',
      short_name: 'Kira',
      brand_name: 'Kira',
      address: 'Cầu Giấy, Hà Nội',
      phone: '0934782112'
    }
    add_company(testData, function (err, respond) {
      var missingOptionalData = {
        id: respond.company.id,
        hostname: 'quan-ly.org',
      }
      update_company(missingOptionalData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.company.hostname).to.equal(missingOptionalData.hostname)
        expect(respond.company.updated_at).to.be.exist()
        done()
      })
    })
  })

  // ---------------------------------------------------------------------------------------------------------------

  it('can NOT update company without id', function (done) {
    var testData = {
      hostname: 'sakura.net',
      full_name: 'Công ty TNHH Sakura',
      short_name: 'Sakura',
      brand_name: 'Sakura',
      address: 'Cầu Giấy, Hà Nội',
      phone: '0934782117'
    }
    add_company(testData, function (err, respond) {
      var undefinedIdData = {
        hostname: 'sakurai.com',
        full_name: 'Công ty TNHH Sakurai',
        short_name: 'Sakurai',
        brand_name: 'Sakurai',
        address: 'Hoàn Kiếm, Hà Nội',
        phone: '0934782119',
        status: 'inactive'
      }
      update_company(undefinedIdData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update company with wrong id', function (done) {
    var testData = {
      hostname: 'sakura.info',
      full_name: 'Công ty Sakura',
      short_name: 'Sakura',
      brand_name: 'Sakura',
      address: 'Cầu Giấy, Hà Nội',
      phone: '0934782123'
    }
    add_company(testData, function (err, respond) {
      var wrongIdData = {
        id: 'wrong-id',
        hostname: 'sakurai.vn',
        full_name: 'Công ty Sakurai',
        short_name: 'Sakurai',
        brand_name: 'Sakurai',
        address: 'Hoàn Kiếm, Hà Nội',
        phone: '0934782127',
        status: 'inactive'
      }
      update_company(wrongIdData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

  it('can NOT update company with too short hostname', function (done) {
    var testData = {
      hostname: 'abcd.info',
      full_name: 'Công ty ABCD',
      short_name: 'ABCD',
      brand_name: 'ABCD',
      address: 'Cầu Giấy, Hà Nội',
      phone: '0934782199'
    }
    add_company(testData, function (err, respond) {
      var perfectData = {
        id: respond.company.id,
        hostname: 'a',
        short_name: 'ACB',
        brand_name: 'ACB',
        address: 'Hà Nội',
        phone: '0934782190',
        status: 'inactive'
      }
      update_company(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update company with too short full_name', function (done) {
    var testData = {
      hostname: 'abc.info',
      full_name: 'Công ty ABC',
      short_name: 'ABC',
      brand_name: 'ABC',
      address: 'Cầu Giấy, Hà Nội',
      phone: '0934782789'
    }
    add_company(testData, function (err, respond) {
      var perfectData = {
        id: respond.company.id,
        hostname: 'acb.info',
        full_name: 'a',
        short_name: 'SHB',
        brand_name: 'SHB',
        address: 'Hà Nội',
        phone: '0934782769',
        status: 'inactive'
      }
      update_company(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT update with company existing', function (done) {
    var testData = {
      hostname: 'hoahaiduong.info',
      full_name: 'Công ty TNHH Hoa Hải Đường',
      short_name: 'Hoa Hải Đường',
      brand_name: 'Hoa Hải Đường',
      address: 'Hà Nội',
      phone: '0934782889'
    }
    add_company(testData, function (err, respond) {
      var existingData = {
        id: respond.company.id,
        hostname: 'abc.info',
        full_name: 'Công ty ABC',
        short_name: 'ABC',
        brand_name: 'ABC',
        address: 'Cầu Giấy, Hà Nội',
        phone: '0934782789',
        status: 'inactive'
      }
      update_company(existingData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('company-existing')
        done()
      })

    })
  })
})