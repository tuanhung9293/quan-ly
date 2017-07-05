/* Copyright (c) 2017 timugz (timugz@gmail.com) */
'use strict'

function InvalidValidateFunctionException (message, argument, intlMessage) {
  this.message = message
  this.argument = argument
  this.intlMessage = intlMessage
  this.name = 'InvalidValidateFunctionException'
}

InvalidValidateFunctionException.prototype.buildIntlMessage = function (plugin, pattern) {
}

module.exports = InvalidValidateFunctionException