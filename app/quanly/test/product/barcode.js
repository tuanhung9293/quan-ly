'use strict'

const Lab = require('lab')
const Code = require('code')
const seneca = require('../seneca')
const Async = require('async')

const lab = exports.lab = Lab.script()
const expect = Code.expect
const describe = lab.describe
const it = lab.it


describe('role:barcode, cmd:generate|check', function () {

  function generate (data, callback) {
    seneca.act('role:barcode, cmd:generate', data, callback)
  }

  it("can generate product's id with input product's id is undefined", function (done) {
    generate({}, function (err, respond) {
      expect(err).not.exist()
      expect(respond.id).to.be.exist()
      done()
    })
  })

  //-------------------------------------------------------------------------------------------------

  function check (data, callback) {
    seneca.act('role:barcode, cmd:check', data, callback)
  }

  it("can check correct product's id from action generate and return result is true", function (done) {
    generate({}, function (err, respond) {
      check({ code: respond.id }, function (err, respond) {
        expect(err).not.exist()
        expect(respond.ok).to.be.true()
        expect(respond.id).to.be.exist()
        done()
      })
    })
  })

  it("can check correct product's id andreturn result is true", function (done) {
    var correct_id_product = '2684729337128'
    check({ code: correct_id_product }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.id).to.equal(correct_id_product)
      done()
    })
  })

  it("check product's id have length not exactly 13 and return result is false", function (done) {
    check({ code: '123456789' }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal("invalid-code")
      done()
    })
  })

  it("check wrong product's id return result is false", function (done) {
    check({ code: '1234567891234' }, function (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal("invalid-code")
      done()
    })
  })

  it("can check array correct product's id return result is true", function (done) {
    var testData = {
      '8936046617891': true,
      '8936062800352': true,
      '8935095615971': true,
      '8935095615766': true,
      '8935081111739': true,
      '8935081111732': false,
      '8935081111735': false,
    }
    Async.mapValues(testData, function (isOk, code, mapNext) {
        check({ code: code }, function (err, respond) {
          expect(err).not.exist()
          expect(respond.ok).to.equal(isOk)
          mapNext()
        })
      }, done
    )
  })
})