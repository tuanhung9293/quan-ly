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
const it = lab.it
const after = lab.after

describe('role:tag, cmd:restore', function () {
  after(function (done) {
    seneca.make$('company', 'tag').native$(function (err, db) {
      var collection = db.collection('company_tag');
      collection.drop()
      done()
    })
  })

  function restore_tag (data, callback) {
    seneca.act('role:tag, cmd:restore', data, callback)
  }

  function add_tag (data, callback) {
    seneca.act('role:tag, cmd:add', data, callback)
  }

  var testData = { type: 'book-name', text: 'Lan va Diep', value: 'truyen dai', status: 'deleted' }

  it('can restore with correct id', function (done) {
    add_tag(testData, function (err, respond) {
      restore_tag({ id: respond.tag.id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.tag.status).to.equal('active')
        done()
      })
    })
  })

  //-------------------------------------------------------------------------------------------------------------------

  it('can NOT restore with tag existing', function (done) {
    add_tag(testData, function (err, respond) {
      restore_tag({ id: respond.tag.id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('tag-existing')
        done()
      })
    })
  })

  it('can NOT restore without id', function (done) {
    var addData = { type: 'book-name', text: 'Cho toi mot ve di tuoi tho', value: 'truyen ngan', status: 'deleted' }
    add_tag(addData, function (err, respond) {
      restore_tag({}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT restore with wrong id', function (done) {
    var addData = { type: 'book-name', text: 'Kinh van hoa', value: 'truyen thieu nhi', status: 'deleted' }
    add_tag(addData, function (err, respond) {
      restore_tag({id: 'wrong-id'}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })
})