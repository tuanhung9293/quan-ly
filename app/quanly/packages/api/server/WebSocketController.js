'use strict'

const Lodash = require('lodash')

const CONTROLLER_FUNCTIONS = [
  'constructor',
  'name',
  'socket',
  'seneca',
  'io',
  'fireEvent',
  'onConnected', 'onDisconnected',
  'senecaProxy',
  'handleSenecaError'
]

export default class WebSocketController {
  constructor (name, socket, seneca, io) {
    this.socket = socket
    this.seneca = seneca
    this.io = io
    this.name = name
  }

  onConnected () {
    var self = this

    var funcs = Object.getOwnPropertyNames(self.__proto__).filter(function (name) {
      return CONTROLLER_FUNCTIONS.indexOf(name) === -1 && typeof self[ name ] === 'function'
    })

    for (var i = 0, l = funcs.length; i < l; i++) {
      if (funcs[ i ].startsWith('on')) {
        continue
      }
      this.socket.on(this.name + '/' + funcs[ i ], this[ funcs[ i ] ].bind(this))
    }

    this.socket.emit('System.onControllerDefined', {
      controller: this.name,
      funcs: funcs
    })
  }

  onDisconnected () {

  }

  fireEvent (eventName, data) {
    this.socket.to(this.name).emit(this.name + '/' + eventName, data)
  }

  senecaProxy (pattern, input, reply, callback) {
    var handshake = {
      layer: 'service'
    }
    if (typeof this.socket.handshake.user !== 'undefined' &&
      typeof this.socket.handshake.company !== 'undefined'
    ) {
      handshake.user = this.socket.handshake.user
      handshake.company = this.socket.handshake.company
    }
    var data = Lodash.assign({}, handshake, input)
    var self = this
    this.seneca.act(pattern, data, (err, respond) => {
      if (err) {
        return this.handleSenecaError(err, reply)
      }

      if (Lodash.isFunction(callback)) {
        return callback.call(self, respond)
      }

      reply(respond)
    })
  }

  handleSenecaError (err, reply) {

  }
}
