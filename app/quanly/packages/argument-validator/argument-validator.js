/* Copyright (c) 2017 timugz (timugz@gmail.com) */
'use strict'

const ArgumentValidatorErrorException = require('./exceptions/ArgumentValidatorErrorException')
const InvalidArgumentException = require('./exceptions/InvalidArgumentException')
const InvalidValidateFunctionException = require('./exceptions/InvalidValidateFunctionException')
const MissingArgumentException = require('./exceptions/MissingArgumentException')
const ValidationException = require('./exceptions/ValidationException')
const TypeErrorException = require('./exceptions/TypeErrorException')

const Lodash = require('lodash')
const Validator = require('validator')

const ASSERTION_REQUIRED = 'required'
const ASSERTION_OPTIONAL = 'optional'
const ASSERTION_DEFAULT_VALUE = 'defaultValue'
const ASSERTION_IS_STRING = 'is_string'
const ASSERTION_IS_BOOLEAN = 'is_boolean'
const ASSERTION_IS_DATE = 'is_date'
const ASSERTION_IS_NUMERIC = 'is_numeric'
const ASSERTION_IS_INTEGER = 'is_integer'
const ASSERTION_IS_FLOAT = 'is_float'
const ASSERTION_IS_OBJECT = 'is_object'
const ASSERTION_IS_ARRAY = 'is_array'
const ASSERTION_MIN = 'min'
const ASSERTION_MAX = 'max'
const ASSERTION_BETWEEN = 'between'
const ASSERTION_IS_EMAIL = 'is_email'
const ASSERTION_NOT_EMPTY = 'not_empty'
const ASSERTION_IN_ARRAY = 'in_array'
const ASSERTION_CUSTOM = 'custom'

const TYPE_STRING = typeof ''
const TYPE_BOOLEAN = typeof true
const TYPE_OBJECT = typeof {}
const TYPE_ARRAY = typeof []
const TYPE_DATE = 'date'
const TYPE_NUMERIC = typeof 0
const TYPE_INTEGER = 'int'
const TYPE_FLOAT = 'float'
const TYPE_ANY = 'any'

const RULE_MIN = 'min'
const RULE_MAX = 'max'
const RULE_BETWEEN = 'between'
const RULE_EMAIL = 'email'
const RULE_IN_ARRAY = 'in-array'
const RULE_NOT_EMPTY = 'not-empty'

const REPLY_WHY = 'invalid-argument'

function ArgumentValidator (args, done) {
  this.args = args
  this.done = done
  this.assertions = {}
  this.data = {}
  this.exceptions = {}

  this.currentArgument = false
}

const execute = function (successCallback, rejectCallback) {
  this.validate()

  try {
    if (this.isValid) {
      if (Lodash.isFunction(successCallback)) {
        successCallback.bind(this, this.data, this.reply.bind(this))()
      }
    } else {
      this.__error(rejectCallback)
    }
  } catch (exception) {
    var exceptionMessage = {
      ok: false,
      why: exception.message
    }
    if (typeof exception.name !== 'undefined') {
      exceptionMessage.exception = exception.name
    }
    if (typeof exception.intlMessage !== 'undefined') {
      exceptionMessage.intlMessage = exception.intlMessage
    }
    if (typeof exception.argument !== 'undefined') {
      exceptionMessage.argument = exception.argument
    }
    this.replyRaw(null, exceptionMessage)
  }

  return this
}

const catch_error = function (callback) {
  this.validate()

  if (!this.isValid) {
    this.__error(callback)
  }
  return this
}

const public_reply = function (data) {
  if (Lodash.isFunction(this.done)) {
    if (Lodash.isBoolean(data)) {
      this.done(null, { ok: data })
    } else if (Lodash.isObject(data)) {
      this.done(null, Lodash.assign({}, { ok: true }, data))
    } else {
      this.done(null, { ok: true, data: data })
    }
  }
  return this
}

const public_reply_raw = function (err, message) {
  if (Lodash.isFunction(this.done)) {
    this.done(err, message)
  }
  return this
}

const public_validate = function () {
  if (typeof this.isValid !== 'undefined') {
    return this
  }

  this.isValid = true
  for (var arg in this.assertions) {
    try {
      this.data[ arg ] = this.__validate_required_optional_default_value(arg, this.assertions[ arg ])
      this.__validate_type_and_strict(arg, this.assertions[ arg ], this.data[ arg ])
      this.__validate_callback(arg, this.assertions[ arg ])
      this.__validate_rules(arg, this.assertions[ arg ], this.data[ arg ])

      if (typeof this.data[ arg ] === 'undefined' && !this.assertions[ arg ].required) {
        delete this.data[ arg ]
      }
    } catch (exception) {
      // console.log(exception)
      this.isValid = false
      continue
    }
  }

  return this
}

// -----------------------------------------------------------------------

const internal_call_callback_with_why_and_exceptions = function (callback) {
  if (Lodash.isFunction(callback)) {
    // TODO: create why and errors array
    return callback.bind(this, this.exceptions, helper_create_errors_from_exceptions(this))()
  }

  this.replyRaw(null, { ok: false, why: REPLY_WHY, errors: helper_create_errors_from_exceptions(this) })
}

const helper_create_errors_from_exceptions = function (argumentValidator) {
  var plugin = ''
  var pattern = ''
  if (typeof argumentValidator.args.meta$ !== 'undefined') {
    plugin = argumentValidator.args.meta$.plugin_name
    pattern = argumentValidator.args.meta$.pattern
  }
  var errors = {}
  for (var arg in argumentValidator.exceptions) {
    if (argumentValidator.exceptions[ arg ].length == 0) {
      continue
    }
    if (typeof errors[ arg ] === 'undefined') {
      errors[ arg ] = []
    }

    for (var i = 0, l = argumentValidator.exceptions[ arg ].length; i < l; i++) {
      argumentValidator.exceptions[ arg ][ i ].buildIntlMessage(plugin, pattern)
      errors[ arg ].push(Lodash.assign({}, argumentValidator.exceptions[ arg ][ i ]))
    }
  }
  return errors
}

const internal_validate_required_optional_default_value = function (arg, assertion) {
// required & optional & defaultValue
  if (assertion.required) {
    if (typeof this.args[ arg ] === 'undefined') {
      this.__throw_missing_argument_exception(arg)
    }

    if (assertion.type === TYPE_STRING && this.args[ arg ] === '') {
      this.__throw_validation_exception(arg, 'required')
    }

    return this.args[ arg ]
  } else if (typeof assertion.defaultValue !== 'undefined' && typeof this.args[ arg ] === 'undefined') {
    if (Lodash.isFunction(assertion.defaultValue)) {
      return assertion.defaultValue.bind(this)()
    }
    return assertion.defaultValue
  }

  return this.args[ arg ]
}

const internal_validate_type_and_strict = function (arg, assertion, value) {
  if (assertion.strict) {
    switch (assertion.type) {
      case TYPE_ANY:
        return this

      case TYPE_ARRAY:
        if (!Lodash.isArray(value)) {
          this.__throw_type_error_exception(arg, assertion.type, true)
        }
        return this

      case TYPE_DATE:
        if (!Lodash.isDate(value)) {
          this.__throw_type_error_exception(arg, assertion.type, true)
        }
        return this

      case TYPE_INTEGER:
      case TYPE_FLOAT:
        if (typeof value !== TYPE_NUMERIC) {
          this.__throw_type_error_exception(arg, assertion.type, true)
        }
        return this

      default:
        if (typeof value !== assertion.type) {
          this.__throw_type_error_exception(arg, assertion.type, true)
        }
        return this
    }
  }

  switch (assertion.type) {
    case TYPE_ANY:
      if (typeof value === 'undefined') {
        return this
      }
      this.data[ arg ] = value
      return this

    case TYPE_STRING:
      if (Lodash.isObject(value) || Lodash.isArray(value)) {
        this.data[ arg ] = JSON.stringify(value)
        return this
      } else if (typeof value !== 'undefined' && Lodash.isFunction(value.toString)) {
        this.data[ arg ] = value.toString()
        return this
      }
      this.data[ arg ] = value
      return this

    case TYPE_BOOLEAN:
      if (Lodash.isString(value)) {
        if (value.trim().toLowerCase() === 'true' || value.trim() === '1') {
          this.data[ arg ] = true
        } else if (value.trim().toLowerCase() === 'false' || value.trim() === '0' || value.trim() === '') {
          this.data[ arg ] = false
        } else {
          this.data[ arg ] = value
        }
        return this
      }
      this.data[ arg ] = value
      return this

    case TYPE_INTEGER:
      if (Lodash.isString(value)) {
        var intVal = parseInt(value)
        if (!isNaN(intVal)) {
          this.data[ arg ] = intVal
          return this
        }
      } else if (Lodash.isDate(value)) {
        this.data[ arg ] = value.getTime()
        return this
      }
      this.data[ arg ] = value
      return this

    case TYPE_NUMERIC:
    case TYPE_FLOAT:
      if (Lodash.isString(value)) {
        var floatVal = parseFloat(value)
        if (!isNaN(floatVal)) {
          this.data[ arg ] = floatVal
          return this
        }
      }
      this.data[ arg ] = value
      return this
  }
  this.data[ arg ] = value
  return this
}

const internal_validate_callback = function (arg, assertion) {
  if (typeof assertion.validate === 'undefined') {
    return;
  }

  if (!Lodash.isFunction(assertion.validate)) {
    this.isValid = false
    throw new InvalidValidateFunctionException('invalid-validate-function', arg)
  }

  var result = assertion.validate.bind(this, this.args, this.data)()
  if (typeof result !== 'boolean') {
    this.isValid = false
    throw new InvalidValidateFunctionException('invalid-validate-function', arg)
  }
  this.isValid = this.isValid && result
}

const internal_validate_rules = function (arg, assertion, value) {
  if (!Lodash.isArray(assertion.rules) || assertion.rules.length === 0) {
    return this
  }

  for (var i = 0, l = assertion.rules.length; i < l; i++) {
    switch (assertion.rules[ i ].rule) {
      case RULE_MIN:
        if (typeof value === TYPE_STRING && value.length < assertion.rules[ i ].value) {
          this.__throw_invalid_argument_exception(arg, 'min-length')
        }

        if (typeof value === TYPE_NUMERIC && value < assertion.rules[ i ].value) {
          this.__throw_invalid_argument_exception(arg, 'min-value')
        }
        break

      case RULE_MAX:
        if (typeof value === TYPE_STRING && value.length > assertion.rules[ i ].value) {
          this.__throw_invalid_argument_exception(arg, 'max-length')
        }

        if (typeof value === TYPE_NUMERIC && value > assertion.rules[ i ].value) {
          this.__throw_invalid_argument_exception(arg, 'max-value')
        }
        break

      case RULE_BETWEEN:
        if (typeof value === TYPE_STRING &&
          (value.length < assertion.rules[ i ].value[ 0 ] || value.length > assertion.rules[ i ].value[ 1 ])) {
          this.__throw_invalid_argument_exception(arg, 'invalid-range')
        }

        if (typeof value === TYPE_NUMERIC &&
          (value < assertion.rules[ i ].value[ 0 ] || value > assertion.rules[ i ].value[ 1 ])) {
          this.__throw_invalid_argument_exception(arg, 'invalid-range')
        }
        break

      case RULE_NOT_EMPTY:
        if ((assertion.required || typeof value !== 'undefined') && Lodash.isEmpty(value)) {
          this.__throw_invalid_argument_exception(arg, 'not-empty')
        }
        break

      case RULE_IN_ARRAY:
        if ((assertion.required || typeof value !== 'undefined') &&
          Lodash.isArray(assertion.rules[ i ].value) && assertion.rules[ i ].value.indexOf(value) === -1) {
          this.__throw_invalid_argument_exception(arg, 'in-array')
        }
        break

      case RULE_EMAIL:
        if (typeof value === TYPE_STRING) {
          if ((assertion.required || value !== '') && !Validator.isEmail(value)) {
            this.__throw_invalid_argument_exception(arg, 'invalid-email')
          }
        }
        break
    }
  }
  return this
}

const internal_throw_missing_argument_exception = function (arg) {
  if (typeof this.exceptions[ arg ] === 'undefined') {
    this.exceptions[ arg ] = []
  }
  var exception = new MissingArgumentException('missing-argument', arg)
  this.exceptions[ arg ].push(exception)
  throw exception
}

const internal_throw_type_error_exception = function (arg, type) {
  if (typeof this.exceptions[ arg ] === 'undefined') {
    this.exceptions[ arg ] = []
  }
  var exception = new TypeErrorException('type-error', arg, type)
  this.exceptions[ arg ].push(exception)
  throw exception
}

const internal_throw_invalid_argument_exception = function (arg, why) {
  if (typeof this.exceptions[ arg ] === 'undefined') {
    this.exceptions[ arg ] = []
  }
  var exception = new InvalidArgumentException(why, arg)
  this.exceptions[ arg ].push(exception)
  throw exception
}

const internal_throw_validation_exception = function (arg, why) {
  if (typeof this.exceptions[ arg ] === 'undefined') {
    this.exceptions[ arg ] = []
  }
  var exception = new ValidationException(why, arg)
  this.exceptions[ arg ].push(exception)
  throw exception
}

const internal_add_assertion = function (attr, rule, params) {
  if (typeof attr === 'undefined' || !attr) {
    throw new ArgumentValidatorErrorException()
  }

  if (typeof this.assertions[ attr ] === 'undefined') {
    this.assertions[ attr ] = {
      required: false,
      type: TYPE_ANY
    }
  }
  switch (rule) {
    case ASSERTION_REQUIRED:
      this.assertions[ attr ][ 'required' ] = true
      return this

    case ASSERTION_OPTIONAL:
      this.assertions[ attr ][ 'required' ] = false
      return this

    case ASSERTION_DEFAULT_VALUE:
      this.assertions[ attr ][ 'defaultValue' ] = params
      return this

    case ASSERTION_IS_STRING:
      this.assertions[ attr ][ 'type' ] = TYPE_STRING
      if (params === true || params === 'strict') {
        this.assertions[ attr ][ 'strict' ] = true
      } else if (params === false) {
        this.assertions[ attr ][ 'strict' ] = false
      }
      return this

    case ASSERTION_IS_BOOLEAN:
      this.assertions[ attr ][ 'type' ] = TYPE_BOOLEAN
      if (params === true || params === 'strict') {
        this.assertions[ attr ][ 'strict' ] = true
      } else if (params === false) {
        this.assertions[ attr ][ 'strict' ] = false
      }
      return this

    case ASSERTION_IS_DATE:
      this.assertions[ attr ][ 'type' ] = TYPE_DATE
      if (params === true || params === 'strict') {
        this.assertions[ attr ][ 'strict' ] = true
      } else if (params === false) {
        this.assertions[ attr ][ 'strict' ] = false
      }
      return this

    case ASSERTION_IS_NUMERIC:
      this.assertions[ attr ][ 'type' ] = TYPE_NUMERIC
      if (params === true || params === 'strict') {
        this.assertions[ attr ][ 'strict' ] = true
      } else if (params === false) {
        this.assertions[ attr ][ 'strict' ] = false
      }
      return this

    case ASSERTION_IS_INTEGER:
      this.assertions[ attr ][ 'type' ] = TYPE_INTEGER
      if (params === true || params === 'strict') {
        this.assertions[ attr ][ 'strict' ] = true
      } else if (params === false) {
        this.assertions[ attr ][ 'strict' ] = false
      }
      return this

    case ASSERTION_IS_FLOAT:
      this.assertions[ attr ][ 'type' ] = TYPE_FLOAT
      if (params === true || params === 'strict') {
        this.assertions[ attr ][ 'strict' ] = true
      } else if (params === false) {
        this.assertions[ attr ][ 'strict' ] = false
      }
      return this

    case ASSERTION_IS_OBJECT:
      this.assertions[ attr ][ 'type' ] = TYPE_OBJECT
      if (params === true || params === 'strict') {
        this.assertions[ attr ][ 'strict' ] = true
      } else if (params === false) {
        this.assertions[ attr ][ 'strict' ] = false
      }
      return this

    case ASSERTION_IS_ARRAY:
      this.assertions[ attr ][ 'type' ] = TYPE_ARRAY
      if (params === true || params === 'strict') {
        this.assertions[ attr ][ 'strict' ] = true
      } else if (params === false) {
        this.assertions[ attr ][ 'strict' ] = false
      }
      return this

    case ASSERTION_MIN:
      if (typeof this.assertions[ attr ][ 'rules' ] === 'undefined') {
        this.assertions[ attr ][ 'rules' ] = []
      }
      this.assertions[ attr ][ 'rules' ].push({ rule: RULE_MIN, value: params })
      return this

    case ASSERTION_MAX:
      if (typeof this.assertions[ attr ][ 'rules' ] === 'undefined') {
        this.assertions[ attr ][ 'rules' ] = []
      }
      this.assertions[ attr ][ 'rules' ].push({ rule: RULE_MAX, value: params })
      return this

    case ASSERTION_BETWEEN:
      if (typeof this.assertions[ attr ][ 'rules' ] === 'undefined') {
        this.assertions[ attr ][ 'rules' ] = []
      }
      this.assertions[ attr ][ 'rules' ].push({ rule: RULE_BETWEEN, value: params })
      return this

    case ASSERTION_IS_EMAIL:
      if (typeof this.assertions[ attr ][ 'rules' ] === 'undefined') {
        this.assertions[ attr ][ 'rules' ] = []
      }
      this.assertions[ attr ][ 'rules' ].push({ rule: RULE_EMAIL })
      return this

    case ASSERTION_NOT_EMPTY:
      if (typeof this.assertions[ attr ][ 'rules' ] === 'undefined') {
        this.assertions[ attr ][ 'rules' ] = []
      }
      this.assertions[ attr ][ 'rules' ].push({ rule: RULE_NOT_EMPTY })
      return this

    case ASSERTION_IN_ARRAY:
      if (typeof this.assertions[ attr ][ 'rules' ] === 'undefined') {
        this.assertions[ attr ][ 'rules' ] = []
      }
      this.assertions[ attr ][ 'rules' ].push({ rule: RULE_IN_ARRAY, value: params })
      return this

    case ASSERTION_CUSTOM:
      this.assertions[ attr ][ 'validate' ] = params
      return this
  }
  return this
}

// -----------------------------------------------------------------------

const func_argument = function (name) {
  this.currentArgument = name
  return this
}

const func_required = function () {
  return this.__add_assertion(this.currentArgument, ASSERTION_REQUIRED)
}

const func_optional = function () {
  return this.__add_assertion(this.currentArgument, ASSERTION_OPTIONAL)
}

const func_default_value = function (value) {
  return this.__add_assertion(this.currentArgument, ASSERTION_DEFAULT_VALUE, value)
}

const func_should_be_string = function (strict) {
  return this.__add_assertion(this.currentArgument, ASSERTION_IS_STRING, strict)
}

const func_should_be_boolean = function (strict) {
  return this.__add_assertion(this.currentArgument, ASSERTION_IS_BOOLEAN, strict)
}

const func_should_be_date = function (strict) {
  return this.__add_assertion(this.currentArgument, ASSERTION_IS_DATE, strict)
}

const func_should_be_integer = function (strict) {
  return this.__add_assertion(this.currentArgument, ASSERTION_IS_INTEGER, strict)
}

const func_should_be_numeric = function (strict) {
  return this.__add_assertion(this.currentArgument, ASSERTION_IS_NUMERIC, strict)
}

const func_should_be_float = function (strict) {
  return this.__add_assertion(this.currentArgument, ASSERTION_IS_FLOAT, strict)
}

const func_should_be_object = function (strict) {
  return this.__add_assertion(this.currentArgument, ASSERTION_IS_OBJECT, strict)
}

const func_should_be_array = function (strict) {
  return this.__add_assertion(this.currentArgument, ASSERTION_IS_ARRAY, strict)
}

const func_min = function (val) {
  return this.__add_assertion(this.currentArgument, ASSERTION_MIN, val)
}

const func_max = function (val) {
  return this.__add_assertion(this.currentArgument, ASSERTION_MAX, val)
}

const func_between = function (min, max) {
  return this.__add_assertion(this.currentArgument, ASSERTION_BETWEEN, [ min, max ])
}

const func_is_email = function () {
  return this.__add_assertion(this.currentArgument, ASSERTION_IS_EMAIL)
}

const func_not_empty = function () {
  return this.__add_assertion(this.currentArgument, ASSERTION_NOT_EMPTY)
}

const func_in_array = function (values) {
  return this.__add_assertion(this.currentArgument, ASSERTION_IN_ARRAY, values)
}

const func_custom = function (callback) {
  return this.__add_assertion(this.currentArgument, ASSERTION_CUSTOM, callback)
}

ArgumentValidator.prototype = {
  __add_assertion: internal_add_assertion,
  __throw_invalid_argument_exception: internal_throw_invalid_argument_exception,
  __throw_missing_argument_exception: internal_throw_missing_argument_exception,
  __throw_validation_exception: internal_throw_validation_exception,
  __throw_type_error_exception: internal_throw_type_error_exception,
  __validate_required_optional_default_value: internal_validate_required_optional_default_value,
  __validate_type_and_strict: internal_validate_type_and_strict,
  __validate_rules: internal_validate_rules,
  __validate_callback: internal_validate_callback,
  __error: internal_call_callback_with_why_and_exceptions,

  // PUBLIC API -------------------------------------------------------------------

  validate: public_validate,
  reply: public_reply,
  replyRaw: public_reply_raw,

  // GRAMMAR -------------------------------------------------------------------

  arg: func_argument,
  argument: func_argument,

  required: func_required,
  isRequired: func_required,
  is_required: func_required,

  optional: func_optional,
  isOptional: func_optional,
  is_optional: func_optional,

  'default': func_default_value,
  defaultValue: func_default_value,
  default_value: func_default_value,

  string: func_should_be_string,
  shouldBeString: func_should_be_string,
  should_be_string: func_should_be_string,

  boolean: func_should_be_boolean,
  shouldBeBoolean: func_should_be_boolean,
  should_be_boolean: func_should_be_boolean,

  date: func_should_be_date,
  shouldBeDate: func_should_be_date,
  should_be_date: func_should_be_date,

  number: func_should_be_numeric,
  shouldBeNumber: func_should_be_numeric,
  should_be_number: func_should_be_numeric,
  numeric: func_should_be_numeric,
  shouldBeNumeric: func_should_be_numeric,
  should_be_numeric: func_should_be_numeric,

  int: func_should_be_integer,
  shouldBeInt: func_should_be_integer,
  should_be_int: func_should_be_integer,
  integer: func_should_be_integer,
  shouldBeInteger: func_should_be_integer,
  should_be_integer: func_should_be_integer,

  float: func_should_be_float,
  shouldBeFloat: func_should_be_float,
  should_be_float: func_should_be_float,
  double: func_should_be_float,
  shouldBeDouble: func_should_be_float,
  should_be_double: func_should_be_float,

  object: func_should_be_object,
  shouldBeAnObject: func_should_be_object,
  should_be_an_object: func_should_be_object,

  array: func_should_be_array,
  shouldBeAnArray: func_should_be_array,
  should_be_an_array: func_should_be_array,

  min: func_min,

  max: func_max,

  between: func_between,

  email: func_is_email,
  isEmail: func_is_email,
  is_email: func_is_email,

  notEmpty: func_not_empty,
  not_empty: func_not_empty,

  custom: func_custom,
  checkBy: func_custom,
  check_by: func_custom,

  oneOf: func_in_array,
  one_of: func_in_array,
  in_array: func_in_array,
  inArray: func_in_array,

  then: execute,
  execute: execute,
  success: execute,

  'catch': catch_error,
  'error': catch_error
}

const create_instance = function (args, done) {
  return new ArgumentValidator(args, done)
}

module.exports = {
  ArgumentValidator: ArgumentValidator,
  check: create_instance,
  assert: create_instance
}
