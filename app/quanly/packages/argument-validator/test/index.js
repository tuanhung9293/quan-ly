/* Copyright (c) 2017 timugz (timugz@gmail.com) */
'use strict'

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var Code = require('code')
var expect = Code.expect
var describe = lab.describe
var it = lab.it

var Seneca = require('seneca')
var seneca = Seneca({ test: true })

var check = require('../argument-validator').check

seneca.use(function () {
  this.add('role:test, cmd:add', function (args, done) {
    check(args, done)
      .arg('name').required()
      .then(function (data, reply) {
        reply({ entity: 'an-entity' })
      })
  })

  this.add('role:test, cmd:instance', function (args, done) {
    check(args, done)
      .arg('name').required()
      .then(function (data, reply) {
        reply({ entity: 'an-entity' })
      })
  })

  return 'test'
})

describe('Seneca integrated', function () {
  it('could prevent invalid data', function (done) {
    seneca.act('role:test, cmd:add', {}, function (err, respond) {
      expect(err).to.not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      expect(respond.errors).to.exist()
      done()
    })
  })

  it('could accept valid data', function (done) {
    seneca.act('role:test, cmd:add', { name: 'something' }, function (err, respond) {
      expect(err).to.not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.entity).to.equal('an-entity')
      done()
    })
  })

  it('should create new instance each call', function (done) {
    seneca.act('role:test, cmd:instance', {}, function (err, respond) {
      expect(err).to.not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('invalid-argument')
      expect(respond.errors).to.exist()

      seneca.act('role:test, cmd:instance', { name: 'something' }, function (err, respond) {
        expect(err).to.not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.entity).to.equal('an-entity')
        done()
      })
    })
  })
})
