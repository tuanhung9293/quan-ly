'use strict'

process.env.COMPANY = 'default'

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

var rowTags = [
  { type: 'book-author', text: 'Nguyen Nhat Anh', value: 'Nguyen Nhat Anh', status: 'active' },
  { type: 'book-author', text: 'Nguyen Ngoc Ngan', value: 'Nguyen Ngoc Ngan', status: 'active' },
  { type: 'book-author', text: 'To Hoai', value: 'To Hoai', status: 'active' },
  { type: 'book-name', text: 'Mat biec', value: 'Mat biec', status: 'inactive' },
  { type: 'book-name', text: 'Kinh van hoa', value: 'truyen thieu nhi', status: 'inactive' },
  { type: 'book-name', text: 'Cho toi mot ve di tuoi tho', value: 'truyen ngan', status: 'deleted' },
  { type: 'book-name', text: 'Lan va Diep', value: 'truyen dai', status: 'deleted' }
]

describe('role:tag, cmd:find|get', function () {
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

  function find_tag (data, callback) {
    seneca.act('role:tag, cmd:find', data, callback)
  }

  it('can find by single field', function (done) {
    find_tag({ id: tags[ 1 ].id }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tag.data$()).to.include(tags[ 1 ])

      find_tag({ text: tags[ 2 ].text }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.tag.data$()).to.include(tags[ 2 ])

        find_tag({ status: tags[ 5 ].status, query: { sort$: { text: 1 } } }, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.tag.data$()).to.include(tags[ 5 ])
          done()
        })
      })
    })
  })

  it('can find by multiple fields', function (done) {
    find_tag({ id: tags[ 2 ].id, text: tags[ 2 ].text }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tag.data$()).to.include(tags[ 2 ])

      find_tag(tags[ 6 ], function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.tag.data$()).to.include(tags[ 6 ])
        done()
      })
    })
  })

  it('can find by query', function (done) {
    find_tag({ query: { value: tags[ 0 ].value } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tag.data$()).to.include(tags[ 0 ])
      done()
    })
  })

  it('can find with no result', function (done) {
    find_tag({ id: tags[ 1 ].id, text: tags[ 2 ].text }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tag).to.not.exist()
      done()
    })
  })

  it('just returns one and only one entity', function (done) {
    find_tag({ status: tags[ 5 ].status }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      if (respond.tag.id == tags[ 5 ].id) {
        expect(respond.tag.data$()).to.include(tags[ 5 ])
      } else {
        expect(respond.tag.data$()).to.include(tags[ 6 ])
      }
      done()
    })
  })

  //--------------------------------------------------------------------------------------------------------------------

  function get_tags (data, callback) {
    seneca.act('role:tag, cmd:get', data, callback)
  }

  it('can get by single field', function (done) {
    get_tags({ type: tags[ 0 ].type, query: { sort$: { text: 1 } } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tags.length).to.equal(3)
      expect(respond.tags[ 0 ].data$()).to.include(tags[ 1 ])
      expect(respond.tags[ 1 ].data$()).to.include(tags[ 0 ])
      expect(respond.tags[ 2 ].data$()).to.include(tags[ 2 ])

      get_tags({ status: tags[ 3 ].status, query: { sort$: { text: 1 } } }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.tags.length).to.equal(2)
        expect(respond.tags[ 0 ].data$()).to.include(tags[ 4 ])
        expect(respond.tags[ 1 ].data$()).to.include(tags[ 3 ])

        get_tags({ status: tags[ 5 ].status, query: { sort$: { text: 1 } } }, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.tags.length).to.equal(2)
          expect(respond.tags[ 0 ].data$()).to.include(tags[ 5 ])
          expect(respond.tags[ 1 ].data$()).to.include(tags[ 6 ])
          done()
        })
      })
    })
  })

  it('can get tags active by single field', function (done) {
    get_tags({ value: tags[ 3 ].value }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tags.length).to.equal(0)
      done()
    })
  })

  it('can get tags by multiple field', function (done) {
    get_tags({ type: tags[ 0 ].type, status: tags[ 0 ].status }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tags.length).to.equal(3)

      get_tags({ type: tags[ 3 ].type, status: tags[ 3 ].status }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.tags.length).to.equal(2)

        get_tags(tags[ 6 ], function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.tags[ 0 ].data$()).to.include(tags[ 6 ])
          done()
        })
      })
    })
  })

  it('can find by query use sort$', function (done) {
    get_tags({ query: { type: 'book-author', sort$: { text: -1 } } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tags[ 0 ].data$()).to.include(tags[ 2 ])
      expect(respond.tags[ 1 ].data$()).to.include(tags[ 0 ])
      expect(respond.tags[ 2 ].data$()).to.include(tags[ 1 ])
      done()
    })
  })

  it('can find by query use sort$ and limit$', function (done) {
    get_tags({ query: { type: 'book-author', sort$: { text: -1 }, limit$: 2 } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.tags[ 0 ].data$()).to.include(tags[ 2 ])
      expect(respond.tags[ 1 ].data$()).to.include(tags[ 0 ])
      done()
    })
  })
})