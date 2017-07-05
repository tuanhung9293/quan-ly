'use strict'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')
const Async = require('async')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const before = lab.before
const it = lab.it
const after = lab.after

var rowCompanies = [
  {
    hostname: 'sakura.com',
    full_name: 'Công ty TNHH Sakura',
    short_name: 'Sakura',
    brand_name: 'Sakura',
    address: 'N11A Trần Quý Kiên, Cầu Giấy, Hà Nội',
    phone: '0934782003',
    status: 'active'
  },
  {
    hostname: 'monkira.com',
    full_name: 'Công ty TNHH MonKira',
    short_name: 'MonKira',
    brand_name: 'MonKira',
    address: 'N21A Trần Quý Kiên, Cầu Giấy, Hà Nội',
    phone: '0934782004',
    status: 'active'
  },
  {
    hostname: 'kira.com',
    full_name: 'Công ty TNHH Kira',
    short_name: 'Kira',
    brand_name: 'Kira',
    address: 'N31A Trần Quý Kiên, Cầu Giấy, Hà Nội',
    phone: '0934782005',
    status: 'active'
  },
  {
    hostname: 'abc.com',
    full_name: 'Công ty TNHH ABC',
    short_name: 'ABC',
    brand_name: 'ABC',
    address: 'N41A Trần Quý Kiên, Cầu Giấy, Hà Nội',
    phone: '0934782006',
    status: 'inactive'
  },
  {
    hostname: 'acb.com',
    full_name: 'Công ty TNHH ACB',
    short_name: 'ACB',
    brand_name: 'ACB',
    address: 'N51A Trần Quý Kiên, Cầu Giấy, Hà Nội',
    phone: '0934782007',
    status: 'inactive'
  },
]

describe('role:company, cmd:find|get', function () {
  after(function (done) {
    seneca.make$(undefined, 'companies').native$(function (err, db) {
      var collection = db.collection('companies');
      collection.drop()
      done()
    })
  })

  var companies = []

  var add_companies = function (done) {
    Async.map(rowCompanies, function (item, mapNext) {
      seneca.act('role:company, cmd:add', item, function (err, respond) {
        mapNext(null, respond.company.data$())
      })
    }, function (err, results) {
      companies = results
      done()
    })
  }

  before(function (done) {
    Async.waterfall([
      add_companies
    ], done)
  })

  function find_company (data, callback) {
    seneca.act('role:company, cmd:find', data, callback)
  }

  it('can find by single field', function (done) {
    find_company({ id: companies[ 2 ].id }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.company.data$()).to.include(companies[ 2 ])

      find_company({ hostname: companies[ 1 ].hostname }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.company.data$()).to.include(companies[ 1 ])

        find_company({ status: companies[ 3 ].status, query: { sort$: { short_name: 1 } } }, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.company.data$()).to.include(companies[ 3 ])
          done()
        })
      })
    })
  })

  it('can find by multiple fields', function (done) {
    find_company({ hostname: companies[ 2 ].hostname, full_name: companies[ 2 ].full_name }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.company.data$()).to.include(companies[ 2 ])

      find_company(companies[ 4 ], function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.company.data$()).to.include(companies[ 4 ])
        done()
      })
    })
  })

  it('can find by query', function (done) {
    find_company({ query: { hostname: companies[ 2 ].hostname } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.company.data$()).to.include(companies[ 2 ])
      done()
    })
  })

  it('can find with no result', function (done) {
    find_company({ id: companies[ 1 ].id, full_name: companies[ 2 ].full_name }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.company).to.not.exist()
      done()
    })
  })

  it('just returns one and only one entity', function (done) {
    find_company({ status: companies[ 3 ].status }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      if (respond.company.id == companies[ 3 ].id) {
        expect(respond.company.data$()).to.include(companies[ 3 ])
      } else {
        expect(respond.company.data$()).to.include(companies[ 4 ])
      }
      done()
    })
  })
})