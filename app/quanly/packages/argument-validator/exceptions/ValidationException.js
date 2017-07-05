/* Copyright (c) 2017 timugz (timugz@gmail.com) */
'use strict'

function ValidationException (message, argument, intlMessage) {
  this.message = message
  this.argument = argument
  this.intlMessage = intlMessage
  this.name = 'ValidationException'
}

ValidationException.prototype.buildIntlMessage = function (plugin, pattern) {
  this.intlMessage = {
    id: [ plugin, pattern, this.argument, this.name, this.message ].join('/'),
    defaultMessage: this.argument + ' is invalid'
  }
}

module.exports = ValidationException
