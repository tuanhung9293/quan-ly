'use strict'

const Lab = require('lab')
const Code = require('code')
const Lodash = require('lodash')
const seneca = require('../seneca')
const Async = require('async');

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const before = lab.before
const after = lab.after
const it = lab.it

var rows = [
  { name: 'test0', phone: '0901010100', email: 'test0@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test1', phone: '0901010101', email: 'test1@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test2', phone: '0901010102', email: 'test2@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test3', phone: '0901010103', email: 'test3@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test4', phone: '0901010104', email: 'test4@gmail.com', address: '123 Penn.', status: 'active' },
  { name: 'test5', phone: '0901010105', email: 'test5@gmail.com', address: '123', status: 'inactive' },
  { name: 'test6', phone: '0901010106', email: 'test6@gmail.com', address: '123', status: 'inactive' },
  { name: 'test7', phone: '0901010107', email: 'test7@gmail.com', address: '123', status: 'inactive' },
  { name: 'test8', phone: '0901010108', email: 'test8@gmail.com', address: '123', status: 'inactive' },
  { name: 'test9', phone: '0901010109', email: 'test8@gmail.com', address: '123', status: 'inactive' }
]

describe('role:retail, cmd:find|get', function () {
  var data = []

  before(function (done) {
    Async.map(
      rows,
      function (item, nextMap) {
        seneca.act('role:retail, cmd:add', item, function (err, respond) {
          nextMap(null, respond.retail.data$())
        })
      },
      function (err, results) {
        data = results
        seneca.act('role:retail, cmd:delete', { id: data[ 8 ] }, function (err, respond) {
          data[ 8 ] = respond.retail.data$()
          seneca.act('role:retail, cmd:delete', { id: data[ 9 ] }, function (err, respond) {
            data[ 9 ] = respond.retail.data$()
            done()
          })
        })
      }
    )
  })

  after(function (done) {
    seneca.make$('company', 'retail').native$(function (err, db) {
      var collection = db.collection('company_retail');
      collection.drop()
      done()
    })
  })

  function find_retail (data, callback) {
    seneca.act('role:retail, cmd:find', data, callback)
  }

  function get_retails (data, callback) {
    seneca.act('role:retail, cmd:get', data, callback)
  }

  it('can find by single field', function (done) {
    find_retail({ id: data[ 3 ].id }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.retail.data$()).to.include(data[ 3 ])

      find_retail({ name: data[ 6 ].name }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        find_retail({ phone: data[ 9 ].phone, status: data[ 9 ].status }, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.retail.data$()).to.include(data[ 9 ])
          done()
        })
      })
    })
  })

  it('can find by some fields', function (done) {
    find_retail({ id: data[ 2 ].id, name: data[ 2 ].name }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.retail.data$()).to.include(data[ 2 ])
      done()
    })
  })

  it('can find by query', function (done) {
    find_retail({ query: { name: data[ 4 ].name } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.retail.data$()).to.include(data[ 4 ])
      done()
    })
  })

  it('can find with no result', function (done) {
    find_retail({ id: data[ 1 ].id, name: data[ 2 ].name }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.retail).to.not.exist()
      done()
    })
  })

  it('just returns one and only one entity', function (done) {
    find_retail({ status: data[ 8 ].status }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      if (respond.retail.id == data[ 8 ].id) {
        expect(respond.retail.data$()).to.include(data[ 8 ])
      } else {
        expect(respond.retail.data$()).to.include(data[ 9 ])
      }
      done()
    })
  })

  // -----------------------------------------------------------
  it('can get by single field', function (done) {
    get_retails({ address: data[ 1 ].address }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.retails.length).to.equal(5)

      get_retails({ status: data[ 5 ].status }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.retails.length).to.equal(3)

        get_retails({ status: data[ 9 ].status }, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.retails.length).to.equal(2)
          done()
        })
      })
    })
  })

  it('can find by query use sort$', function (done) {
    get_retails({ status: 'deleted', query: { sort$: { name: -1 } } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.retails[ 0 ].data$()).to.include(data[ 9 ])
      expect(respond.retails[ 1 ].data$()).to.include(data[ 8 ])
      done()
    })
  })

  it('can find by query use sort$ and limit$', function (done) {
    get_retails({ query: { status: 'active', sort$: { name: -1 }, limit$: 2 } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.retails[ 0 ].data$()).to.include(data[ 4 ])
      expect(respond.retails[ 1 ].data$()).to.include(data[ 3 ])
      done()
    })
  })
})