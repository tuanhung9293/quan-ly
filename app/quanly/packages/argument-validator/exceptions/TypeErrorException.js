/* Copyright (c) 2017 timugz (timugz@gmail.com) */
'use strict'

function TypeErrorException (message, argument, type, intlMessage) {
  this.message = message
  this.argument = argument
  this.type = type
  this.intlMessage = intlMessage
  this.name = 'TypeErrorException'
}

TypeErrorException.prototype.buildIntlMessage = function (plugin, pattern) {
  this.intlMessage = {
    id: [ plugin, pattern, this.argument, this.name, this.type, this.message ].join('/'),
    defaultMessage: this.argument + ' should be a/an ' + this.type
  }
}

module.exports = TypeErrorException