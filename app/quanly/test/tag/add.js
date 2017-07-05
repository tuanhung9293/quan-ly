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

describe('role:tag, cmd:add', function () {
  after(function (done) {
    seneca.make$('company', 'tag').native$(function (err, db) {
      var collection = db.collection('company_tag');
      collection.drop()
      done()
    })
  })

  function add_tag (data, callback) {
    seneca.act('role:tag, cmd:add', data, callback)
  }

  function expect_timestamp_fields_and_status (respond) {
    expect(respond.tag.created_at).to.be.exist()
    expect(respond.tag.updated_at).to.be.exist()
    expect(respond.tag.status).to.equal('active')
  }

  it('can add tag with perfect data', function (done) {
    var perfectData = {
      type: 'book-author',
      text: 'Nguyen Ngoc Ngan',
      value: 'truyen ngan'
    }
    add_tag(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.tag.id).to.be.exist()
      expect(respond.tag).to.include(perfectData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add tag and remove whitespace of text', function (done) {
    var perfectData = {
      type: 'book-author',
      text: '   Nguyen Ngoc Ngan   ',
      value: 'truyen kinh di'
    }
    var expectedData = {
      type: 'book-author',
      text: 'Nguyen Ngoc Ngan',
      value: 'truyen kinh di'
    }
    add_tag(perfectData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.tag.id).to.be.exist()
      expect(respond.tag).to.include(expectedData)
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add tag with missing optional data', function (done) {
    var missingData = {
      type: 'book-name',
      text: 'Kinh van hoa',
    }
    add_tag(missingData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.tag.id).to.be.exist()
      expect(respond.tag.type).to.equal(missingData.type)
      expect(respond.tag.text).to.equal(missingData.text)
      expect(respond.tag.value).to.equal('kinh van hoa')
      expect_timestamp_fields_and_status(respond)
      done()
    })
  })

  it('can add tag with existing data - status is deleted', function (done) {
    var existingData = {
      type: 'book-name',
      text: 'Kinh van hoa',
      status: 'deleted'
    }
    add_tag(existingData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()

      expect(respond.tag.id).to.be.exist()
      expect(respond.tag.type).to.equal(existingData.type)
      expect(respond.tag.text).to.equal(existingData.text)
      expect(respond.tag.value).to.equal('kinh van hoa')
      expect(respond.tag.deleted_at).to.be.exist()
      expect(respond.tag.status).to.equal(existingData.status)
      done()
    })
  })

  //-------------------------------------------------------------------------------------------------

  var invalid_callback = function (done) {
    return function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      done()
    }
  }

  it('can NOT add tag with missing required data', function (done) {
    var missingData = {}
    add_tag(missingData, invalid_callback(done))
  })

  it('can NOT add tag with too short type', function (done) {
    var shortTypeData = {
      type: 'a',
      text: 'Nguyen Nhat Anh',
      value: 'truyen ngan'
    }
    add_tag(shortTypeData, invalid_callback(done))
  })

  it('can NOT add tag with too short text', function (done) {
    var shortTextData = {
      type: 'book-author',
      text: 'a',
      value: 'truyen ngan'
    }
    add_tag(shortTextData, invalid_callback(done))
  })

  it('can NOT add tag with tag is existing', function (done) {
    var existingData = {
      type: 'book-author',
      text: 'Nguyen Ngoc Ngan',
      value: 'truyen ngan'
    }
    add_tag(existingData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('tag-existing')
      done()
    })
  })

  it('can NOT add tag with tag is existing - missing value', function (done) {
    var existingData = {
      type: 'book-author',
      text: 'Truyen Ngan'
    }
    add_tag(existingData, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('tag-existing')
      done()
    })
  })
})