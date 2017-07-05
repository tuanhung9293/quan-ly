'use strict'

process.env.COMPANY = 'test'

const Lab = require('lab')
const Code = require('code')
const Async = require('async')
const seneca = require('../seneca')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const before = lab.before
const after = lab.after
const it = lab.it

var rows = [
  { name: 'test-0', alias: 'test-0', is_admin: true, is_default: false, is_removable: true, status: 'active' },
  { name: 'test-1', alias: 'test-1', is_admin: false, is_default: true, is_removable: false, status: 'active' },
  { name: 'test-2', alias: 'test-2', is_admin: false, is_default: false, is_removable: true, status: 'active' },
  { name: 'test-3', alias: 'test-3', is_admin: true, is_default: false, is_removable: true, status: 'inactive' },
  { name: 'test-4', alias: 'test-4', is_admin: false, is_default: true, is_removable: false, status: 'inactive' },
  { name: 'test-5', alias: 'test-5', is_admin: false, is_default: false, is_removable: true, status: 'inactive' },
  { name: 'test-6', alias: 'test-6', is_admin: true, is_default: false, is_removable: true, status: 'deleted' },
  { name: 'test-7', alias: 'test-7', is_admin: false, is_default: true, is_removable: false, status: 'deleted' },
  { name: 'test-8', alias: 'test-8', is_admin: false, is_default: false, is_removable: true, status: 'deleted' },
]

describe('role:role, cmd:find|get', function () {
  var data = []
  before(function (done) {
    Async.map(rows, function (item, next) {
      seneca.act('role:role, cmd:add', item, function (err, respond) {
        next(null, respond.role.data$())
      })
    }, function (err, roles) {
      data = roles
      done()
    })
  })

  after(function (done) {
    seneca.make$('access_rights', 'roles').native$(function (err, db) {
      db.collection('access_rights_roles').drop()
      done()
    })
  })

  function find_role (data, callback) {
    seneca.act('role:role, cmd:find', data, callback)
  }

  function get_roles (data, callback) {
    seneca.act('role:role, cmd:get', data, callback)
  }

  it('can find by single field', function (done) {
    find_role({ id: data[ 0 ].id }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.role.data$()).to.include(data[ 0 ])

      find_role({ name: data[ 1 ].name }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()

        find_role({ alias: data[ 2 ].alias }, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.role.data$()).to.include(data[ 2 ])
          done()
        })
      })
    })
  })

  it('can find by some fields', function (done) {
    find_role({ is_default: data[ 2 ].is_default, name: data[ 2 ].name }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.role.data$()).to.include(data[ 2 ])
      done()
    })
  })

  it('can find by query', function (done) {
    find_role({ query: { name: data[ 3 ].name }, status: 'inactive' }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.role.data$()).to.include(data[ 3 ])
      done()
    })
  })

  it('can find with no result', function (done) {
    find_role({ id: data[ 1 ].id, name: data[ 2 ].name }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.role).to.not.exist()
      done()
    })
  })

  it('just returns one and only one entity', function (done) {
    find_role({ status: data[ 8 ].status }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      if (respond.role.id === data[ 6 ].id) {
        expect(respond.role.data$()).to.include(data[ 6 ])
      } else if (respond.role.id === data[ 7 ].id) {
        expect(respond.role.data$()).to.include(data[ 7 ])
      } else if (respond.role.id === data[ 8 ].id) {
        expect(respond.role.data$()).to.include(data[ 8 ])
      }
      done()
    })
  })

  // -----------------------------------------------------------
  it('can get by single field', function (done) {
    get_roles({ is_admin: data[ 0 ].is_admin }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.roles.length).to.equal(1)

      get_roles({ status: data[ 3 ].status }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.roles.length).to.equal(3)

        get_roles({ is_default: data[ 3 ].is_default }, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.be.true()
          expect(respond.roles.length).to.equal(2)
          done()
        })
      })
    })
  })

  it('can find by query use sort$', function (done) {
    get_roles({ status: 'deleted', query: { sort$: { name: -1 } } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.roles[ 0 ].data$()).to.include(data[ 8 ])
      expect(respond.roles[ 1 ].data$()).to.include(data[ 7 ])
      expect(respond.roles[ 2 ].data$()).to.include(data[ 6 ])
      done()
    })
  })

  it('can find by query use sort$ and limit$', function (done) {
    get_roles({ query: { status: 'active', sort$: { name: -1 }, limit$: 2 } }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.roles[ 0 ].data$()).to.include(data[ 2 ])
      expect(respond.roles[ 1 ].data$()).to.include(data[ 1 ])
      done()
    })
  })
})