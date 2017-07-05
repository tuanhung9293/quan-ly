'use strict'

process.env.COMPANY = 'default'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it
const after = lab.after

describe('role:tag, cmd:delete', function () {
  after(function (done) {
    seneca.make$('company', 'tag').native$(function (err, db) {
      var collection = db.collection('company_tag');
      collection.drop()
      done()
    })
  })

  it('can delete tag with correct id', function (done) {
    var testData = {
      type: 'book-author',
      text: 'Nguyen Nhat Anh',
      value: 'truyen ngan'
    }
    seneca.act('role:tag, cmd: add', testData, function (err, respond) {
      var id = respond.tag.id
      seneca.act('role:tag, cmd:delete', { id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.tag.status).to.equal('deleted')
        expect(respond.tag.deleted_at).to.be.exist()
        done()
      })
    })
  })

  //---------------------------------------------------------------------------------------------------------

  it('can NOT delete tag without id', function (done) {
    var testData = {
      type: 'book-name',
      text: 'mat biec',
      value: 'truyen ngan'
    }
    seneca.act('role:tag, cmd: add', testData, function (err, respond) {
      seneca.act('role:tag, cmd:delete', {}, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('invalid-argument')
        done()
      })
    })
  })

  it('can NOT delete tag with wrong id', function (done) {
    var testData = {
      type: 'book-name',
      text: 'Toi thay hoa vang tren co xanh',
      value: 'truyen ngan'
    }
    seneca.act('role:tag, cmd: add', testData, function (err, respond) {
      var id = 'invalid-id'
      seneca.act('role:tag, cmd:delete', { id: id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })
})