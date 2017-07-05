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

describe('role:tag, cmd:update', function () {
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

  function update_tag (data, callback) {
    seneca.act('role:tag, cmd:update', data, callback)
  }

  var testData = {
    type: 'book-author',
    text: 'Nguyen Nhat Anh',
    value: 'truyen ngan'
  }

  it('can update tag with perfect data', function (done) {
    add_tag(testData, function (err, respond) {
      var perfectData = {
        id: respond.tag.id,
        type: 'book-education',
        text: 'Tieng Viet lop 5',
        value: 'sach giao khoa',
        status: 'inactive'
      }
      update_tag(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.tag.id).to.be.exist()
        expect(respond.tag).to.include(perfectData)
        expect(respond.tag.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update tag and remove whitespace of text', function (done) {
    add_tag(testData, function (err, respond) {
      var perfectData = {
        id: respond.tag.id,
        type: 'book-author',
        text: '   To Hoai    ',
        value: 'truyen thieu nhi',
        status: 'inactive'
      }
      var expectedData = {
        id: respond.tag.id,
        type: 'book-author',
        text: 'To Hoai',
        value: 'truyen thieu nhi',
        status: 'inactive'
      }
      update_tag(perfectData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.tag.id).to.be.exist()
        expect(respond.tag).to.include(expectedData)
        expect(respond.tag.updated_at).to.be.exist()
        done()
      })
    })
  })

  it('can update tag with missing optinal data', function (done) {
    add_tag(testData, function (err, respond) {
      var missingData = {
        id: respond.tag.id,
        type: 'book-name',
        text: 'Cay dua than hoa hoc'
      }
      update_tag(missingData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        expect(respond.tag.id).to.be.exist()
        expect(respond.tag.type).to.equal(missingData.type)
        expect(respond.tag.text).to.equal(missingData.text)
        expect(respond.tag.updated_at).to.be.exist()
        done()
      })
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

  it('can NOT update tag with too short type', function (done) {
    add_tag(testData, function (err, respond) {
      var shortTypeData = {
        id: respond.tag.id,
        type: 'a',
        text: 'Nguyen Ngoc Ngan',
        value: 'truyen ma',
        status: 'inactive'
      }
      update_tag(shortTypeData, invalid_callback(done))
    })
  })

  it('can NOT update tag with too short text', function (done) {
    var addTestData = {
      type: 'book-name',
      text: 'Mat biec',
      value: 'Mat biec'
    }
    add_tag(addTestData, function (err, respond) {
      var shortTextData = {
        id: respond.tag.id,
        type: 'book-name',
        text: 'a',
        value: 'truyen ma',
        status: 'inactive'
      }
      update_tag(shortTextData, invalid_callback(done))
    })
  })

  it('can NOT update product with wrong status', function (done) {
    var addTestData = {
      type: 'book-name',
      text: 'Toi thay hoa vang tren co xanh'
    }
    add_tag(addTestData, function (err, respond) {
      var wrongStatusData = {
        id: respond.tag.id,
        type: 'book-author',
        text: 'Nguyen Quang Sang',
        value: 'Nguyen Quang Sang',
        status: 'deletedd'
      }
      update_tag(wrongStatusData, invalid_callback(done))
    })
  })

  it('can NOT update tag without id', function (done) {
    var addTestData = {
      type: 'book-name',
      text: 'Toi thay hoa vang tren co xanh',
    }
    add_tag(addTestData, function (err, respond) {
      var undefinedIdData = {
        type: 'book-education',
        text: 'Tieng Viet lop 4 tap 1',
        value: 'Tieng Viet lop 4 tap 1',
        status: 'inactive'
      }
      update_tag(undefinedIdData, invalid_callback(done))
    })
  })

  it('can NOT update tag with wrong id', function (done) {
    var addTestData = {
      type: 'book-name',
      text: 'Cho toi xin mot ve di tuoi tho'
    }
    add_tag(addTestData, function (err, respond) {
      var wrongIdData = {
        id: 'wrong-id',
        type: 'book-education',
        text: 'Toan lop 5 tap 1',
        value: 'Toan lop 5 tap 1',
        status: 'inactive'
      }
      update_tag(wrongIdData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('not-found')
        done()
      })
    })
  })

  it('can NOT update tag with tag is existing', function (done) {
    var addTestData = {
      type: 'book-name',
      text: 'Con chut gi de nho'
    }
    add_tag(addTestData, function (err, respond) {
      var wrongIdData = {
        id: respond.tag.id,
        type: 'book-education',
        text: 'Nguyen Nhat Anh',
        value: 'sach giao khoa',
        status: 'inactive'
      }
      update_tag(wrongIdData, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.false()
        expect(respond.why).to.equal('tag-existing')
        done()
      })
    })
  })
})