/* Copyright (c) 2017 timugz (timugz@gmail.com) */
'use strict'

function InvalidArgumentException (message, argument, intlMessage) {
  this.message = message
  this.argument = argument
  this.intlMessage = intlMessage
  this.name = 'InvalidArgumentException'
}

InvalidArgumentException.prototype.buildIntlMessage = function (plugin, pattern) {
  this.intlMessage = {
    id: [ plugin, pattern, this.argument, this.name, this.message ].join('/')
  }
}

module.exports = InvalidArgumentException