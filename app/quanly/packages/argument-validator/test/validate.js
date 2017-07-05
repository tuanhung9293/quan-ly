/* Copyright (c) 2017 timugz (timugz@gmail.com) */
'use strict'

var Lodash = require('lodash')
var Lab = require('lab')
var lab = exports.lab = Lab.script()
var Code = require('code')
var expect = Code.expect
var suite = lab.suite
var test = lab.test

const argsValidator = require('../argument-validator').check

suite('ArgumentValidator.validate()', function () {

// __validate_required_optional_default_value --------------------------------------------------
  var defaultCallbackSync = function (next) {
    return 'test'
  }

  var requiredAndOptionalDataSet = [
    [
      {},
      'name', { required: false, type: 'any' }, undefined,
      {}
    ],
    [
      {},
      'name', { required: true, type: 'any' }, undefined,
      {
        'name': [ {
          argument: 'name',
          message: 'missing-argument',
          name: 'MissingArgumentException'
        } ]
      }
    ],
    [
      {},
      'name', { required: false, type: 'string', defaultValue: 'test' }, 'test',
      {}
    ],
    [
      {},
      'name', { required: false, type: 'string', defaultValue: defaultCallbackSync }, 'test',
      {}
    ],
    [
      {},
      'name', { required: true, type: 'string', defaultValue: 'test' }, undefined,
      {
        'name': [ {
          argument: 'name',
          message: 'missing-argument',
          name: 'MissingArgumentException'
        } ]
      }
    ],
    [
      {},
      'name', { required: true, type: 'string', defaultValue: defaultCallbackSync }, undefined,
      {
        'name': [ {
          argument: 'name',
          message: 'missing-argument',
          name: 'MissingArgumentException'
        } ]
      }
    ],
    [
      { name: '' },
      'name', { required: true, type: 'string' }, undefined,
      {
        name: [ {
          argument: 'name',
          message: 'required',
          name: 'ValidationException'
        } ]
      }
    ],
    [
      { name: 'test' },
      'name', { required: true, type: 'string' }, 'test',
      {}
    ],
    [
      { phone: 123 },
      'phone', { required: true, type: 'numeric' }, 123,
      {}
    ]
  ].map(function (data, index) {
    test('__validate_required_optional_default_value()#' + index + ':' + JSON.stringify(data), function (done) {
      var args = data[ 0 ],
        arg = data[ 1 ],
        assertion = data[ 2 ],
        returnValue = data[ 3 ],
        exception = data[ 4 ]

      var argumentValidator = argsValidator(args)
      var result
      try {
        result = argumentValidator.__validate_required_optional_default_value(
          arg, assertion
        )
      } catch (exception) {

      }
      expect(result).to.equal(returnValue)
      for (var arg in argumentValidator.exceptions) {
        for (var i = 0, l = argumentValidator.exceptions[ arg ].length; i < l; i++) {
          delete argumentValidator.exceptions[ arg ][ i ].intlMessage
        }
      }
      expect(argumentValidator.exceptions).to.equal(exception)
      done()
    })
  })

// __validate_type_and_strict --------------------------------------------------
  var typeAndStrictDataSet = [
    [ 'name', { type: 'any', strict: true }, undefined, false ],
    [ 'name', { type: 'any', strict: true }, 123, false ],
    [ 'name', { type: 'any', strict: true }, new Date, false ],
    [ 'name', { type: 'any', strict: true }, true, false ],
    [ 'name', { type: 'any', strict: true }, [], false ],
    [ 'name', { type: 'any', strict: true }, {}, false ],
    [ 'name', { type: 'any', strict: true }, '', false ],

    [ 'name', { type: 'boolean', strict: true }, undefined, true ],
    [ 'name', { type: 'boolean', strict: true }, 123, true ],
    [ 'name', { type: 'boolean', strict: true }, new Date, true ],
    [ 'name', { type: 'boolean', strict: true }, true, false ],
    [ 'name', { type: 'boolean', strict: true }, [], true ],
    [ 'name', { type: 'boolean', strict: true }, {}, true ],
    [ 'name', { type: 'boolean', strict: true }, '', true ],

    [ 'name', { type: 'int', strict: true }, undefined, true ],
    [ 'name', { type: 'int', strict: true }, 123, false ],
    [ 'name', { type: 'int', strict: true }, new Date, true ],
    [ 'name', { type: 'int', strict: true }, true, true ],
    [ 'name', { type: 'int', strict: true }, [], true ],
    [ 'name', { type: 'int', strict: true }, {}, true ],
    [ 'name', { type: 'int', strict: true }, '', true ],

    [ 'name', { type: 'float', strict: true }, undefined, true ],
    [ 'name', { type: 'float', strict: true }, 123, false ],
    [ 'name', { type: 'float', strict: true }, new Date, true ],
    [ 'name', { type: 'float', strict: true }, true, true ],
    [ 'name', { type: 'float', strict: true }, [], true ],
    [ 'name', { type: 'float', strict: true }, {}, true ],
    [ 'name', { type: 'float', strict: true }, '', true ],

    [ 'name', { type: 'date', strict: true }, undefined, true ],
    [ 'name', { type: 'date', strict: true }, 123, true ],
    [ 'name', { type: 'date', strict: true }, new Date, false ],
    [ 'name', { type: 'date', strict: true }, true, true ],
    [ 'name', { type: 'date', strict: true }, [], true ],
    [ 'name', { type: 'date', strict: true }, {}, true ],
    [ 'name', { type: 'date', strict: true }, '', true ],

    [ 'name', { type: 'object', strict: true }, undefined, true ],
    [ 'name', { type: 'object', strict: true }, 123, true ],
    [ 'name', { type: 'object', strict: true }, new Date, true ],
    [ 'name', { type: 'object', strict: true }, true, true ],
    [ 'name', { type: 'object', strict: true }, [], false ],
    [ 'name', { type: 'object', strict: true }, {}, true ],
    [ 'name', { type: 'object', strict: true }, '', true ],

    [ 'name', { type: 'string', strict: true }, undefined, true ],
    [ 'name', { type: 'string', strict: true }, 123, true ],
    [ 'name', { type: 'string', strict: true }, new Date, true ],
    [ 'name', { type: 'string', strict: true }, true, true ],
    [ 'name', { type: 'string', strict: true }, [], true ],
    [ 'name', { type: 'string', strict: true }, {}, true ],
    [ 'name', { type: 'string', strict: true }, '', false ],

    [ 'name', { type: 'any' }, undefined, false, undefined ],
    [ 'name', { type: 'any' }, 123, false, 123 ],
    [ 'name', { type: 'any' }, true, false, true ],
    [ 'name', { type: 'any' }, false, false, false ],
    [ 'name', { type: 'any' }, new Date(2017, 1, 1, 0, 0, 0), false, new Date(2017, 1, 1, 0, 0, 0) ],
    [ 'name', { type: 'any' }, { test: true }, false, { test: true } ],
    [ 'name', { type: 'any' }, [ false, 1, 2 ], false, [ false, 1, 2 ] ],

    [ 'name', { type: 'string' }, 123, false, '123' ],
    [ 'name', { type: 'string' }, true, false, 'true' ],
    [ 'name', { type: 'string' }, false, false, 'false' ],
    [ 'name', { type: 'string' }, new Date(2017, 1, 1, 0, 0, 0), false, '"2017-01-31T17:00:00.000Z"' ],
    [ 'name', { type: 'string' }, { test: true }, false, '{"test":true}' ],
    [ 'name', { type: 'string' }, [ false, 1, 2 ], false, '[false,1,2]' ],

    [ 'name', { type: 'boolean' }, '1   ', false, true ],
    [ 'name', { type: 'boolean' }, '  TrUe ', false, true ],
    [ 'name', { type: 'boolean' }, '  fAlse  ', false, false ],
    [ 'name', { type: 'boolean' }, '   0   ', false, false ],
    [ 'name', { type: 'boolean' }, '   ', false, false ],
    [ 'name', { type: 'boolean' }, 'something else', false, 'something else' ],
    [ 'name', { type: 'boolean' }, new Date(2017, 1, 1, 0, 0, 0), false, new Date(2017, 1, 1, 0, 0, 0) ],
    [ 'name', { type: 'boolean' }, true, false, true ],
    [ 'name', { type: 'boolean' }, false, false, false ],
    [ 'name', { type: 'boolean' }, {}, false, {} ],
    [ 'name', { type: 'boolean' }, [], false, [] ],

    [ 'name', { type: 'int' }, '1', false, 1 ],
    [ 'name', { type: 'int' }, '1.234', false, 1 ],
    [ 'name', { type: 'int' }, 'a000', false, 'a000' ],
    [ 'name', { type: 'int' }, 'something else', false, 'something else' ],
    [ 'name', { type: 'int' }, new Date(2017, 1, 1, 0, 0, 0), false, (new Date(2017, 1, 1, 0, 0, 0)).getTime() ],
    [ 'name', { type: 'int' }, true, false, true ],
    [ 'name', { type: 'int' }, false, false, false ],
    [ 'name', { type: 'int' }, {}, false, {} ],
    [ 'name', { type: 'int' }, [], false, [] ],

    [ 'name', { type: 'float' }, '1', false, 1 ],
    [ 'name', { type: 'float' }, '1.234', false, 1.234 ],
    [ 'name', { type: 'float' }, 'a000', false, 'a000' ],
    [ 'name', { type: 'float' }, 'something else', false, 'something else' ],
    [ 'name', { type: 'float' }, new Date(2017, 1, 1, 0, 0, 0), false, (new Date(2017, 1, 1, 0, 0, 0)) ],
    [ 'name', { type: 'float' }, true, false, true ],
    [ 'name', { type: 'float' }, false, false, false ],
    [ 'name', { type: 'float' }, {}, false, {} ],
    [ 'name', { type: 'float' }, [], false, [] ],

    [ 'name', { type: 'number' }, '1', false, 1 ],
    [ 'name', { type: 'number' }, '1.234', false, 1.234 ],
    [ 'name', { type: 'number' }, 'a000', false, 'a000' ],
    [ 'name', { type: 'number' }, 'something else', false, 'something else' ],
    [ 'name', { type: 'number' }, new Date(2017, 1, 1, 0, 0, 0), false, (new Date(2017, 1, 1, 0, 0, 0)) ],
    [ 'name', { type: 'number' }, true, false, true ],
    [ 'name', { type: 'number' }, false, false, false ],
    [ 'name', { type: 'number' }, {}, false, {} ],
    [ 'name', { type: 'number' }, [], false, [] ],

    [ 'name', { type: 'object' }, '1', false, '1' ],
    [ 'name', { type: 'object' }, '1.234', false, '1.234' ],
    [ 'name', { type: 'object' }, 'a000', false, 'a000' ],
    [ 'name', { type: 'object' }, new Date(2017, 1, 1, 0, 0, 0), false, (new Date(2017, 1, 1, 0, 0, 0)) ],
    [ 'name', { type: 'object' }, {}, false, {} ],
    [ 'name', { type: 'object' }, [], false, [] ],

    [ 'name', { type: 'array' }, '1', false, '1' ],
    [ 'name', { type: 'array' }, '1.234', false, '1.234' ],
    [ 'name', { type: 'array' }, 'a000', false, 'a000' ],
    [ 'name', { type: 'array' }, new Date(2017, 1, 1, 0, 0, 0), false, (new Date(2017, 1, 1, 0, 0, 0)) ],
    [ 'name', { type: 'array' }, {}, false, {} ],
    [ 'name', { type: 'array' }, [], false, [] ],

    [ 'name', { type: 'date' }, '1', false, '1' ],
    [ 'name', { type: 'date' }, '1.234', false, '1.234' ],
    [ 'name', { type: 'date' }, 'a000', false, 'a000' ],
    [ 'name', { type: 'date' }, new Date(2017, 1, 1, 0, 0, 0), false, (new Date(2017, 1, 1, 0, 0, 0)) ],
    [ 'name', { type: 'date' }, {}, false, {} ],
    [ 'name', { type: 'date' }, [], false, [] ],
  ].map(function (data, index) {
    test('__validate_type_and_strict()#' + index + ':' + JSON.stringify(data), function (done) {
      var arg = data[ 0 ],
        assertion = data[ 1 ],
        value = data[ 2 ],
        hasError = data[ 3 ],
        convertedValue = data[ 4 ]
      var argumentValidator = argsValidator({})
      try {
        argumentValidator.__validate_type_and_strict(arg, assertion, value)
      } catch (exception) {

      }
      if (hasError) {
        expect(argumentValidator.exceptions[ arg ].length).to.not.equal(0)
      } else {
        expect(argumentValidator.exceptions[ arg ]).to.not.exist()
      }
      if (typeof convertedValue !== 'undefined') {
        expect(argumentValidator.data[ arg ]).to.equal(convertedValue)
      }

      done()
    })
  })

// __validate_callback --------------------------------------------------
  var validateCallbackDataSet = [
    [ 'name', function () { return true }, false, true ],
    [ 'name', function () { return false }, false, false ],
    [ 'name', function () { return 'what the hell?' }, true, false ],
    [ 'name', null, true, false ],
    [ 'name', function () { return true }, false, false, false ],
    [ 'name', function () { return false }, false, false, false ],
  ].map(function (data) {
    test('__validate_callback()', function (done) {
      var arg = data[ 0 ],
        validateCallback = data[ 1 ],
        hasError = data[ 2 ],
        isValid = data[ 3 ],
        initialIsValid = typeof data[ 4 ] !== 'undefined' ? data[ 4 ] : true

      var av = argsValidator({ name: 'should be passed' })
      av.isValid = initialIsValid
      av.data = { test: 'also pass data' }

      var hasException = false
      try {
        if (Lodash.isFunction(validateCallback)) {
          av.__validate_callback(arg, {
            validate: function (args, data) {
              expect(this).to.equal(av)
              expect(args).to.equal(av.args)
              expect(data).to.equal(av.data)
              return validateCallback()
            }
          })
        } else {
          av.__validate_callback(arg, {
            validate: validateCallback
          })
        }
        expect(av.isValid).to.equal(isValid)
      } catch (exception) {
        hasException = true
        if (hasError === true) {
          expect(exception.name).to.equal('InvalidValidateFunctionException')
        }
      }
      if (hasError === false) {
        expect(hasException).to.be.false()
      }
      done()
    })
  })

// __validate_rules --------------------------------------------------
  var validateRulesDataSet = [
    [ {}, '', false ],
    [ [], '', false ],

    [ [ { rule: 'min', value: 0 } ], '', false, 'min-length' ],
    [ [ { rule: 'min', value: 1 } ], '', true, 'min-length' ],
    [ [ { rule: 'min', value: 2 } ], 'a', true, 'min-length' ],
    [ [ { rule: 'min', value: 0 } ], 0, false, 'min-value' ],
    [ [ { rule: 'min', value: 0 } ], -1, true, 'min-value' ],
    [ [ { rule: 'min', value: 0 } ], 1, false, 'min-value' ],

    [ [ { rule: 'max', value: 3 } ], '', false, 'max-length' ],
    [ [ { rule: 'max', value: 3 } ], 'aaa', false, 'max-length' ],
    [ [ { rule: 'max', value: 3 } ], 'bbbb', true, 'max-length' ],
    [ [ { rule: 'max', value: 3 } ], 0, false, 'max-value' ],
    [ [ { rule: 'max', value: 3 } ], 3, false, 'max-value' ],
    [ [ { rule: 'max', value: 3 } ], 4, true, 'max-value' ],

    [ [ { rule: 'min', value: 2 }, { rule: 'max', value: 3 } ], '', true, 'min-length' ],
    [ [ { rule: 'min', value: 2 }, { rule: 'max', value: 3 } ], 'aaa', false, 'min-length' ],
    [ [ { rule: 'min', value: 2 }, { rule: 'max', value: 3 } ], 'bbbb', true, 'max-length' ],
    [ [ { rule: 'min', value: 2 }, { rule: 'max', value: 3 } ], 0, true, 'min-value' ],
    [ [ { rule: 'min', value: 2 }, { rule: 'max', value: 3 } ], 3, false, 'min-value' ],
    [ [ { rule: 'min', value: 2 }, { rule: 'max', value: 3 } ], 4, true, 'max-value' ],

    [ [ { rule: 'between', value: [ 2, 3 ] } ], '', true, 'invalid-range' ],
    [ [ { rule: 'between', value: [ 2, 3 ] } ], 'aaa', false, 'invalid-range' ],
    [ [ { rule: 'between', value: [ 2, 3 ] } ], 'bbbb', true, 'invalid-range' ],
    [ [ { rule: 'between', value: [ 2, 3 ] } ], 0, true, 'invalid-range' ],
    [ [ { rule: 'between', value: [ 2, 3 ] } ], 3, false, 'invalid-range' ],
    [ [ { rule: 'between', value: [ 2, 3 ] } ], 4, true, 'invalid-range' ],

    [ [ { rule: 'not-empty' } ], '', true, 'not-empty' ],
    [ [ { rule: 'not-empty' } ], '   ', true, 'not-empty' ],
    [ [ { rule: 'not-empty' } ], [], true, 'not-empty' ],
    [ [ { rule: 'not-empty' } ], {}, true, 'not-empty' ],
    [ [ { rule: 'not-empty' } ], 'a', false, 'not-empty' ],
    [ [ { rule: 'not-empty' } ], [ 1 ], false, 'not-empty' ],
    [ [ { rule: 'not-empty' } ], { test: 1 }, false, 'not-empty' ],

    [ [ { rule: 'email' } ], '', true, 'invalid-email' ],
    [ [ { rule: 'email' } ], '  ', true, 'invalid-email' ],
    [ [ { rule: 'email' } ], 'test', true, 'invalid-email' ],
    [ [ { rule: 'email' } ], 'test@', true, 'invalid-email' ],
    [ [ { rule: 'email' } ], 'test@test', true, 'invalid-email' ],
    [ [ { rule: 'email' } ], 'test@.com', true, 'invalid-email' ],
    [ [ { rule: 'email' } ], 'test@test.com', true, 'invalid-email' ],
    [ [ { rule: 'email' } ], {}, true, 'invalid-email' ],

    [ [ { rule: 'in-array', value: {} } ], 'active', false, 'in-array' ],
    [ [ { rule: 'in-array', value: 'active' } ], 'active', false, 'in-array' ],
    [ [ { rule: 'in-array', value: [] } ], 'active', true, 'in-array' ],
    [ [ { rule: 'in-array', value: [ 'inactive' ] } ], 'active', true, 'in-array' ],
    [ [ { rule: 'in-array', value: [ 'active', 'inactive' ] } ], 'active', false, 'in-array' ],

    [ [ { rule: 'not-empty' }, { rule: 'between', value: [ 2, 3 ] } ], 'a', true, 'invalid-range' ],
    [ [ { rule: 'not-empty' }, { rule: 'between', value: [ 2, 3 ] } ], 'aaa', true, 'not-empty' ],
  ].map(function (data, index) {
    test('__validate_rules#' + index + ': ' + JSON.stringify(data), function (done) {
      var rules = data[ 0 ],
        value = data[ 1 ],
        hasError = data[ 2 ],
        message = data[ 3 ]

      var av = argsValidator()
      var hasException = false
      try {
        av.__validate_rules('name', { rules: rules }, value)
      } catch (exception) {
        hasException = true
        if (hasError) {
          expect(exception.message).to.equal(message)
          expect(exception.name).to.equal('InvalidArgumentException')
        }
      }
      if (!hasError) {
        expect(hasException).to.be.false()
      }
      done()
    })
  })

// validate --------------------------------------------------
  test('validate.required()', function (done) {
    argsValidator({}, null)
      .arg('name').required()
      .then(function () {
        expect('it should never happens').to.not.exist()
      })
      .catch(function (err) {
        done()
      })
  })

  test('validate.optional().default(\'\').isEmail() does not throw an error', function (done) {
    argsValidator({}, null)
      .arg('email').optional().default('').isEmail()
      .then(function (data) {
        expect(data.email).to.equal('')
        done()
      })
      .catch(function (err) {
        expect('it should never happens').to.not.exist()
      })
  })

  test('validate.optional().default(\'\').isEmail() throws an error', function (done) {
    argsValidator({ email: 'test' }, null)
      .arg('email').optional().default('').isEmail()
      .then(function (data) {
        expect('it should never happens').to.not.exist()
      })
      .catch(function (err) {
        done()
      })
  })

  test('validate.required().isEmail()', function (done) {
    argsValidator({}, null)
      .arg('email').required().isEmail()
      .then(function (data) {
        expect('it should never happens').to.not.exist()
      })
      .catch(function (err) {
        done()
      })
  })

  test('validate.optional().notEmpty() does not throw an error', function (done) {
    argsValidator({}, null)
      .arg('email').optional().notEmpty()
      .then(function (data) {
        expect(data.email).to.be.undefined()
        done()
      })
      .catch(function (err) {
        expect('it should never happens').to.not.exist()
      })
  })

  test('validate.optional().default(\'\').notEmpty() throws an error', function (done) {
    argsValidator({}, null)
      .arg('email').optional().default('').notEmpty()
      .then(function (data) {
        expect('it should never happens').to.not.exist()
      })
      .catch(function (err) {
        done()
      })
  })

  test('validate.required().notEmpty()', function (done) {
    argsValidator({}, null)
      .arg('email').required().notEmpty()
      .then(function (data) {
        expect('it should never happens').to.not.exist()
      })
      .catch(function (err) {
        done()
      })
  })

  test('validate.optional().inArray() does not throw an error', function (done) {
    argsValidator({}, null)
      .arg('status').optional().inArray(['active', 'inactive'])
      .then(function (data) {
        expect(data.status).to.be.undefined()
        done()
      })
      .catch(function (err) {
        expect('it should never happens').to.not.exist()
      })
  })

  test('validate.optional().default(\'\').inArray() throws an error', function (done) {
    argsValidator({}, null)
      .arg('status').optional().default('').inArray(['active', 'inactive'])
      .then(function (data) {
        expect('it should never happens').to.not.exist()
      })
      .catch(function (err) {
        done()
      })
  })

  test('validate.required().inArray()', function (done) {
    argsValidator({status: 'tmp'}, null)
      .arg('status').required().inArray(['active', 'inactive'])
      .then(function (data) {
        expect('it should never happens').to.not.exist()
      })
      .catch(function (err) {
        done()
      })
  })
})
