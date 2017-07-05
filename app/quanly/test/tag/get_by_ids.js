'use strict'

process.env.COMPANY = 'default'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')
const Lodash = require('lodash')
const Async = require('async')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const before = lab.before
const it = lab.it
const after = lab.after

var rowTags = [
  { type: 'book-author', text: 'Nguyen Nhat Anh', value: 'Nguyen Nhat Anh', status: 'active' },
  { type: 'book-author', text: 'Nguyen Ngoc Ngan', value: 'Nguyen Ngoc Ngan', status: 'active' },
  { type: 'book-author', text: 'To Hoai', value: 'To Hoai', status: 'active' },
  { type: 'book-name', text: 'Mat biec', value: 'Mat biec', status: 'inactive' },
  { type: 'book-name', text: 'Kinh van hoa', value: 'truyen thieu nhi', status: 'inactive' },
  { type: 'book-name', text: 'Cho toi mot ve di tuoi tho', value: 'truyen ngan', status: 'deleted' },
  { type: 'book-name', text: 'Lan va Diep', value: 'truyen dai', status: 'deleted' }
]

describe('role:tag, cmd:get-by-ids', function () {
  after(function (done) {
    seneca.make$('company', 'tag').native$(function (err, db) {
      var collection = db.collection('company_tag');
      collection.drop()
      done()
    })
  })

  var tags = []

  var add_tags = function (done) {
    Async.map(rowTags, function (item, mapNext) {
      seneca.act('role:tag, cmd:add', item, function (err, respond) {
        mapNext(null, respond.tag.data$())
      })
    }, function (err, results) {
      tags = results
      done()
    })
  }

  before(function (done) {
    Async.waterfall([
      add_tags
    ], done)
  })

  function get_by_ids (data, callback) {
    seneca.act('role:tag, cmd:get-by-ids', data, callback)
  }

  it('can get by correct ids', function (done) {
    var testData = { ids: [ tags[ 0 ].id, tags[ 1 ].id, tags[ 2 ].id ] }
    get_by_ids(testData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tags[ 0 ].data$()).to.include(tags[ 1 ])
      expect(respond.tags[ 1 ].data$()).to.include(tags[ 0 ])
      expect(respond.tags[ 2 ].data$()).to.include(tags[ 2 ])
      done()
    })
  })
  it('can get by valid ids and do not return tag with invalid id', function (done) {
    var testData = { ids: [ tags[ 0 ].id, tags[ 2 ].id, '000000000000000000000000' ] }
    get_by_ids(testData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tags[ 0 ].data$()).to.include(tags[ 0 ])
      expect(respond.tags[ 1 ].data$()).to.include(tags[ 2 ])
      done()
    })
  })
  //--------------------------------------------------------------------------------------------------------------------

  it('can NOT get without ids is empty', function (done) {
    var testData = { ids: [] }
    get_by_ids(testData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('not-found')
      done()
    })
  })

  it('can NOT get with missing data', function (done) {
    var missingData = {}
    get_by_ids(missingData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    })
  })

})