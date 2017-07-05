'use strict'

const Lab = require('lab')
const Code = require('code')
const Async = require('async')
const Lodash = require('lodash')
const Moment = require('moment')
const seneca = require('../seneca')
const Endpoints = require('../../packages/log/lib/constants')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const before = lab.before
const after = lab.after
const it = lab.it

describe('role:log, layer-service', function () {
  before(function (done) {
    var data = {
      '01': '2016-01-01T01:00:01',
      '02': '2016-01-01T01:00:02',
      '03': '2016-01-02T00:00:01',
      '04': '2016-01-02T00:00:02',
      '05': '2016-01-02T00:00:03',
      '06': '2017-03-10',
      '07': '2017-03-12',
      '08': '2017-03-13',
      '09': '2017-03-14',
      '10': '2017-03-15',
    }
    Async.mapValues(data, function (date, no, next) {
      var item = {
        user: 'get-service',
        item_type: 'test',
        item_id: 1,
        action: 'test',
        text: 'log-' + no,
        created_at: Moment(date).toDate()
      }
      seneca.act('role:log, cmd:add', item, next())
    }, done)
  })

  after(function (done) {
    seneca.make$('logs').native$(function (err, db) {
      db.collection('logs').drop()
      done()
    })
  })

  function layer_service_get (args, callback) {
    seneca.act(
      'role:log, cmd:get, layer:service',
      Lodash.assign({}, { user: { id: 'get-service' } }, args),
      callback
    )
  }

  it('provides get with offset and offsetDate', function (done) {
    layer_service_get({ offset: '-7 days' }, function (err, respond) {
      expect(err).to.not.exist()
      expect(respond.logs.length).to.equal(0)
      expect(Moment(respond.offset_date).format('YYYY-MM-DD')).to.equal(Moment().add(-7, 'days').format('YYYY-MM-DD'))

      layer_service_get({ offset: '-1 days', offsetDate: '2017-03-16' }, function (err, respond) {
        expect(err).to.not.exist()
        expect(respond.logs.length).to.equal(1)
        expect(Moment(respond.offset_date).format('YYYY-MM-DD')).to.equal('2017-03-15')

        layer_service_get({ offset: '-3 days', offsetDate: '2017-03-15' }, function (err, respond) {
          expect(err).to.not.exist()
          expect(respond.logs.length).to.equal(4)
          expect(Moment(respond.offset_date).format('YYYY-MM-DD')).to.equal('2017-03-12')

          layer_service_get({ offset: '-3 months', offsetDate: '2017-03-15' }, function (err, respond) {
            expect(err).to.not.exist()
            expect(respond.logs.length).to.equal(5)
            expect(Moment(respond.offset_date).format('YYYY-MM-DD')).to.equal('2016-12-15')
            done()
          })
        })
      })
    })
  })

  it('provides get with "date"', function (done) {
    layer_service_get({ date: '2016-01-01' }, function (err, respond) {
      expect(err).to.not.exist()
      expect(respond.logs.length).to.equal(2)
      expect(respond.offset_date).to.be.undefined()
      done()
    })
  })

  it('provides get with "start" date', function (done) {
    layer_service_get({ start: '2016-01-02' }, function (err, respond) {
      expect(err).to.not.exist()
      expect(respond.logs.length).to.equal(8) // skip 2 logs in 2016-01-01
      expect(respond.offset_date).to.be.undefined()
      done()
    })
  })

  it('provides get with "start" and "end" date', function (done) {
    layer_service_get({ start: '2016-01-01', end: '2016-01-03' }, function (err, respond) {
      expect(err).to.not.exist()
      expect(respond.logs.length).to.equal(5)
      expect(respond.offset_date).to.be.undefined()
      done()
    })
  })
})