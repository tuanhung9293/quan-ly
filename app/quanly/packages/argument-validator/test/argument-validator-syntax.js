/* Copyright (c) 2017 timugz (timugz@gmail.com) */
'use strict'

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var Code = require('code')
var expect = Code.expect
var describe = lab.describe
var it = lab.it

const ArgumentValidatorErrorException = require('../exceptions/ArgumentValidatorErrorException')

const argsValidator = require('../argument-validator').check

describe('ArgumentValidator Syntax', function () {
  it('have to use arg or argument before add specification', function (done) {
    try {
      argsValidator({}).required()
    } catch (error) {
      expect(error).to.be.an.instanceof(ArgumentValidatorErrorException)
    }

    var args = argsValidator({})
      .arg('arg1').required()
      .argument('arg2').required()

    expect(args.assertions).to.equals({
      arg1: { required: true, type: 'any' },
      arg2: { required: true, type: 'any' },
    })
    done()
  })

  it('supports required or optional with defaulValue', function (done) {
    var args = argsValidator({})
      .arg('arg1').required()
      .arg('arg2').optional().default('arg2')
      .arg('arg3').isOptional().defaultValue('arg3')
      .arg('arg4').is_optional().default_value('arg4')
      .arg('arg5').is_required().optional().default_value('arg5')
      .arg('arg6').optional().isRequired().default_value('arg6')
      .arg('arg7').default('arg7').optional().required()

    expect(args.assertions).to.equals({
      arg1: { required: true, type: 'any' },
      arg2: { required: false, type: 'any', defaultValue: 'arg2' },
      arg3: { required: false, type: 'any', defaultValue: 'arg3' },
      arg4: { required: false, type: 'any', defaultValue: 'arg4' },
      arg5: { required: false, type: 'any', defaultValue: 'arg5' },
      arg6: { required: true, type: 'any', defaultValue: 'arg6' },
      arg7: { required: true, type: 'any', defaultValue: 'arg7' },
    })
    done()
  })

  it('can check argument with type String', function (done) {
    var args = argsValidator({})
      .arg('arg1').string()
      .arg('arg2').shouldBeString()
      .arg('arg3').should_be_string()
      .arg('arg4').string(true)
      .arg('arg5').shouldBeString(false)
      .arg('arg6').should_be_string(true)
      .arg('arg7').string('strict')
      .arg('arg8').shouldBeString('strict')
      .arg('arg9').should_be_string('strict')

    expect(args.assertions).to.equals({
      arg1: { required: false, type: typeof '' },
      arg2: { required: false, type: typeof '' },
      arg3: { required: false, type: typeof '' },
      arg4: { required: false, type: typeof '', strict: true },
      arg5: { required: false, type: typeof '', strict: false },
      arg6: { required: false, type: typeof '', strict: true },
      arg7: { required: false, type: typeof '', strict: true },
      arg8: { required: false, type: typeof '', strict: true },
      arg9: { required: false, type: typeof '', strict: true },
    })

    done()
  })

  it('can check argument with type Boolean', function (done) {
    var args = argsValidator({})
      .arg('arg1').boolean()
      .arg('arg2').shouldBeBoolean()
      .arg('arg3').should_be_boolean()
      .arg('arg4').boolean(true)
      .arg('arg5').shouldBeBoolean(false)
      .arg('arg6').should_be_boolean(true)
      .arg('arg7').boolean('strict')
      .arg('arg8').shouldBeBoolean('strict')
      .arg('arg9').should_be_boolean('strict')

    expect(args.assertions).to.equals({
      arg1: { required: false, type: typeof true },
      arg2: { required: false, type: typeof true },
      arg3: { required: false, type: typeof true },
      arg4: { required: false, type: typeof true, strict: true },
      arg5: { required: false, type: typeof true, strict: false },
      arg6: { required: false, type: typeof true, strict: true },
      arg7: { required: false, type: typeof true, strict: true },
      arg8: { required: false, type: typeof true, strict: true },
      arg9: { required: false, type: typeof true, strict: true },
    })

    done()
  })

  it('can check argument with type Date', function (done) {
    var args = argsValidator({})
      .arg('arg1').date()
      .arg('arg2').shouldBeDate()
      .arg('arg3').should_be_date()
      .arg('arg4').date(true)
      .arg('arg5').shouldBeDate(false)
      .arg('arg6').should_be_date(true)
      .arg('arg7').date('strict')
      .arg('arg8').shouldBeDate('strict')
      .arg('arg9').should_be_date('strict')

    expect(args.assertions).to.equals({
      arg1: { required: false, type: 'date' },
      arg2: { required: false, type: 'date' },
      arg3: { required: false, type: 'date' },
      arg4: { required: false, type: 'date', strict: true },
      arg5: { required: false, type: 'date', strict: false },
      arg6: { required: false, type: 'date', strict: true },
      arg7: { required: false, type: 'date', strict: true },
      arg8: { required: false, type: 'date', strict: true },
      arg9: { required: false, type: 'date', strict: true },
    })

    done()
  })

  it('can check argument with type Number', function (done) {
    var args = argsValidator({})
      .arg('arg1').number()
      .arg('arg2').shouldBeNumber()
      .arg('arg3').should_be_number()
      .arg('arg4').number(true)
      .arg('arg5').shouldBeNumber(false)
      .arg('arg6').should_be_number(true)
      .arg('arg7').number('strict')
      .arg('arg8').shouldBeNumber('strict')
      .arg('arg9').should_be_number('strict')

    var expected = {
      arg1: { required: false, type: typeof 0 },
      arg2: { required: false, type: typeof 0 },
      arg3: { required: false, type: typeof 0 },
      arg4: { required: false, type: typeof 0, strict: true },
      arg5: { required: false, type: typeof 0, strict: false },
      arg6: { required: false, type: typeof 0, strict: true },
      arg7: { required: false, type: typeof 0, strict: true },
      arg8: { required: false, type: typeof 0, strict: true },
      arg9: { required: false, type: typeof 0, strict: true },
    }
    expect(args.assertions).to.equals(expected)

    var args = argsValidator({})
      .arg('arg1').numeric()
      .arg('arg2').shouldBeNumeric()
      .arg('arg3').should_be_numeric()
      .arg('arg4').numeric(true)
      .arg('arg5').shouldBeNumeric(false)
      .arg('arg6').should_be_numeric(true)
      .arg('arg7').numeric('strict')
      .arg('arg8').shouldBeNumeric('strict')
      .arg('arg9').should_be_numeric('strict')
    expect(args.assertions).to.equals(expected)
    done()
  })

  it('can check argument with type Integer', function (done) {
    var args = argsValidator({})
      .arg('arg1').int()
      .arg('arg2').shouldBeInt()
      .arg('arg3').should_be_int()
      .arg('arg4').int(true)
      .arg('arg5').shouldBeInt(false)
      .arg('arg6').should_be_int(true)
      .arg('arg7').int('strict')
      .arg('arg8').shouldBeInt('strict')
      .arg('arg9').should_be_int('strict')

    var expected = {
      arg1: { required: false, type: 'int' },
      arg2: { required: false, type: 'int' },
      arg3: { required: false, type: 'int' },
      arg4: { required: false, type: 'int', strict: true },
      arg5: { required: false, type: 'int', strict: false },
      arg6: { required: false, type: 'int', strict: true },
      arg7: { required: false, type: 'int', strict: true },
      arg8: { required: false, type: 'int', strict: true },
      arg9: { required: false, type: 'int', strict: true },
    }
    expect(args.assertions).to.equals(expected)

    var args = argsValidator({})
      .arg('arg1').integer()
      .arg('arg2').shouldBeInteger()
      .arg('arg3').should_be_integer()
      .arg('arg4').integer(true)
      .arg('arg5').shouldBeInteger(false)
      .arg('arg6').should_be_integer(true)
      .arg('arg7').integer('strict')
      .arg('arg8').shouldBeInteger('strict')
      .arg('arg9').should_be_integer('strict')
    expect(args.assertions).to.equals(expected)
    done()
  })

  it('can check argument with type Float', function (done) {
    var args = argsValidator({})
      .arg('arg1').float()
      .arg('arg2').shouldBeFloat()
      .arg('arg3').should_be_float()
      .arg('arg4').float(true)
      .arg('arg5').shouldBeFloat(false)
      .arg('arg6').should_be_float(true)
      .arg('arg7').float('strict')
      .arg('arg8').shouldBeFloat('strict')
      .arg('arg9').should_be_float('strict')

    var expected = {
      arg1: { required: false, type: 'float' },
      arg2: { required: false, type: 'float' },
      arg3: { required: false, type: 'float' },
      arg4: { required: false, type: 'float', strict: true },
      arg5: { required: false, type: 'float', strict: false },
      arg6: { required: false, type: 'float', strict: true },
      arg7: { required: false, type: 'float', strict: true },
      arg8: { required: false, type: 'float', strict: true },
      arg9: { required: false, type: 'float', strict: true },
    }
    expect(args.assertions).to.equals(expected)

    var args = argsValidator({})
      .arg('arg1').double()
      .arg('arg2').shouldBeDouble()
      .arg('arg3').should_be_double()
      .arg('arg4').double(true)
      .arg('arg5').shouldBeDouble(false)
      .arg('arg6').should_be_double(true)
      .arg('arg7').double('strict')
      .arg('arg8').shouldBeDouble('strict')
      .arg('arg9').should_be_double('strict')
    expect(args.assertions).to.equals(expected)
    done()
  })

  it('can check argument with type Object', function (done) {
    var args = argsValidator({})
      .arg('arg1').object()
      .arg('arg2').shouldBeAnObject()
      .arg('arg3').should_be_an_object()
      .arg('arg4').object(true)
      .arg('arg5').shouldBeAnObject(false)
      .arg('arg6').should_be_an_object(true)
      .arg('arg7').object('strict')
      .arg('arg8').shouldBeAnObject('strict')
      .arg('arg9').should_be_an_object('strict')

    expect(args.assertions).to.equals({
      arg1: { required: false, type: typeof {} },
      arg2: { required: false, type: typeof {} },
      arg3: { required: false, type: typeof {} },
      arg4: { required: false, type: typeof {}, strict: true },
      arg5: { required: false, type: typeof {}, strict: false },
      arg6: { required: false, type: typeof {}, strict: true },
      arg7: { required: false, type: typeof {}, strict: true },
      arg8: { required: false, type: typeof {}, strict: true },
      arg9: { required: false, type: typeof {}, strict: true },
    })
    done()
  })

  it('can check argument with type Array', function (done) {
    var args = argsValidator({})
      .arg('arg1').array()
      .arg('arg2').shouldBeAnArray()
      .arg('arg3').should_be_an_array()
      .arg('arg4').array(true)
      .arg('arg5').shouldBeAnArray(false)
      .arg('arg6').should_be_an_array(true)
      .arg('arg7').array('strict')
      .arg('arg8').shouldBeAnArray('strict')
      .arg('arg9').should_be_an_array('strict')

    expect(args.assertions).to.equals({
      arg1: { required: false, type: typeof [] },
      arg2: { required: false, type: typeof [] },
      arg3: { required: false, type: typeof [] },
      arg4: { required: false, type: typeof [], strict: true },
      arg5: { required: false, type: typeof [], strict: false },
      arg6: { required: false, type: typeof [], strict: true },
      arg7: { required: false, type: typeof [], strict: true },
      arg8: { required: false, type: typeof [], strict: true },
      arg9: { required: false, type: typeof [], strict: true },
    })
    done()
  })

  it('can provide validate function in syntax min/max/between', function (done) {
    var args = argsValidator({})
      .arg('arg1').min()
      .arg('arg2').min(1)
      .arg('arg3').max()
      .arg('arg4').max(2)
      .arg('arg5').between(1, 2)

    expect(args.assertions).to.equals({
      arg1: { required: false, type: 'any', rules: [{ rule: 'min', value: undefined }] },
      arg2: { required: false, type: 'any', rules: [{ rule: 'min', value: 1 }] },
      arg3: { required: false, type: 'any', rules: [{ rule: 'max', value: undefined }] },
      arg4: { required: false, type: 'any', rules: [{ rule: 'max', value: 2 }] },
      arg5: { required: false, type: 'any', rules: [{ rule: 'between', value: [ 1, 2 ] }] },
    })
    done()
  })

  it('provides the syntax like Promise/then', function (done) {
    argsValidator({})
      .arg('name').optional()
      .then(function (data, reply) {
        expect(typeof reply).to.equal(typeof function () {})

        argsValidator({})
          .arg('name').required()
          .then(function (reply) {
            expect('never be called').to.not.exist()
          }, function (why, errors) {
            expect(why).to.exist()
            expect(errors).to.exist()
            done()
          })
      })
  })

  it('provides the syntax like Promise but detect that is not function', function (done) {
    argsValidator({})
      .arg('name').optional()
      .then(true)
    argsValidator({})
      .arg('name').required()
      .then(true, false)
    done()
  })

  it('provides the syntax like Promise/catch', function (done) {
    argsValidator({})
      .arg('name').required()
      .then(function (reply) {
        expect('never be called').to.not.exist()
      })
      .catch(function (why, errors) {
        expect(why).to.exist()
        expect(errors).to.exist()
        done()
      })
  })

  it('provides the syntax like Promise/catch, never call catch if valid', function (done) {
    argsValidator({})
      .arg('name').optional()
      .catch(function (why, errors) {
        expect('never be called').to.not.exist()
      })
      .then(function (reply) {
        done()
      })
  })

  it("can catch an exception inside successCallback and use exception's message as why", function (done) {
    argsValidator({}, reply)
      .arg('name').optional()
      .then(function (data, reply) {
        throw {
          message: 'exception-message'
        }
      })

    function reply (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('exception-message')
      done()
    }
  })

  it("can catch an exception inside successCallback and use exception's name as exception", function (done) {
    argsValidator({}, reply)
      .arg('name').optional()
      .then(function (data, reply) {
        throw {
          message: 'exception-message',
          name: 'AnyException'
        }
      })

    function reply (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.exist()
      expect(respond.argument).to.not.exist()
      expect(respond.intlMessage).to.not.exist()
      expect(respond.exception).to.equal('AnyException')
      done()
    }
  })

  it("can catch an exception inside successCallback and add exception's intlMessage", function (done) {
    argsValidator({}, reply)
      .arg('name').optional()
      .then(function (data, reply) {
        throw {
          message: 'exception-message',
          intlMessage: { id: 'exception-message' },
        }
      })

    function reply (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.exist()
      expect(respond.exception).to.not.exist()
      expect(respond.argument).to.not.exist()
      expect(respond.intlMessage).to.equal({ id: 'exception-message' })
      done()
    }
  })

  it("can catch an exception inside successCallback and add exception's argument", function (done) {
    argsValidator({}, reply)
      .arg('name').optional()
      .then(function (data, reply) {
        throw {
          message: 'exception-message',
          argument: 'something'
        }
      })

    function reply (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.exist()
      expect(respond.exception).to.not.exist()
      expect(respond.intlMessage).to.not.exist()
      expect(respond.argument).to.equal('something')
      done()
    }
  })

  it("can catch an exception inside rejectCallback and use exception's message as why", function (done) {
    argsValidator({}, reply)
      .arg('name').required()
      .then(function (data, reply) {
      }, function () {
        throw {
          message: 'exception-message'
        }
      })

    function reply (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.equal('exception-message')
      done()
    }
  })

  it("can catch an exception inside rejectCallback and use exception's name as exception", function (done) {
    argsValidator({}, reply)
      .arg('name').required()
      .then(function (data, reply) {
      }, function () {
        throw {
          message: 'exception-message',
          name: 'AnyException'
        }
      })

    function reply (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.exist()
      expect(respond.argument).to.not.exist()
      expect(respond.intlMessage).to.not.exist()
      expect(respond.exception).to.equal('AnyException')
      done()
    }
  })

  it("can catch an exception inside rejectCallback and add exception's intlMessage", function (done) {
    argsValidator({}, reply)
      .arg('name').required()
      .then(function (data, reply) {
      }, function () {
        throw {
          message: 'exception-message',
          intlMessage: { id: 'exception-message' }
        }
      })

    function reply (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.exist()
      expect(respond.exception).to.not.exist()
      expect(respond.argument).to.not.exist()
      expect(respond.intlMessage).to.equal({ id: 'exception-message' })
      done()
    }
  })

  it("can catch an exception inside rejectCallback and add exception's argument", function (done) {
    argsValidator({}, reply)
      .arg('name').required()
      .then(function (data, reply) {
      }, function () {
        throw {
          message: 'exception-message',
          argument: 'something'
        }
      })

    function reply (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.false()
      expect(respond.why).to.exist()
      expect(respond.exception).to.not.exist()
      expect(respond.intlMessage).to.not.exist()
      expect(respond.argument).to.equal('something')
      done()
    }
  })

  it("provide reply with true/false which is ok signal", function (done) {
    argsValidator({}, reply)
      .arg('name').optional()
      .then()
      .reply(true)

    function reply (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      done()
    }
  })

  it("provide reply with object which auto assign and add ok signal", function (done) {
    argsValidator({}, reply)
      .arg('name').optional()
      .then()
      .reply({ anything: 'something' })

    function reply (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.anything).to.equal('something')
      done()
    }
  })

  it("provide reply with any type - that is data in respond object + ok signal", function (done) {
    argsValidator({}, reply)
      .arg('name').optional()
      .then()
      .reply(1)

    function reply (err, respond) {
      expect(err).not.exist()
      expect(respond.ok).to.be.true()
      expect(respond.data).to.equal(1)
      done()
    }
  })

  it("never calls done callback if reply is not a function", function (done) {
    argsValidator({}, true)
      .arg('name').optional()
      .reply(1)
      .then(function () {
        done()
      })
  })

  it("provides replyRaw which will call done function", function (done) {
    argsValidator({}, reply)
      .arg('name').optional()
      .replyRaw('test', 'any')

    function reply (err, respond) {
      expect(err).to.equal('test')
      expect(respond).to.equal('any')
      done()
    }
  })

  it("provides replyRaw which never be called if done is not a function", function (done) {
    argsValidator({}, true)
      .arg('name').optional()
      .replyRaw('test', 'any')
      .then(function () {
        done()
      })
  })
})
