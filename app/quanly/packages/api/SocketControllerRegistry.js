'use strict'

import Lodash from 'lodash'

export default class SocketControllerRegistry {
  constructor (socket, data, socketName) {
    this.socket = socket
    this.controller = data.controller
    this.functions = data.funcs
    this.socketName = socketName
    this.definition = {}

    if (process.env.NODE_ENV !== 'production') {
      console.groupCollapsed('[Code] ' + socketName + '.' + data.controller)
    }
    for (var i = 0, l = this.functions.length; i < l; i++) {
      var prop = this.functions[ i ]

      if (this.isEvent(prop)) {
        this.definition[ prop ] = this.handleEventFunction(prop)
        if (process.env.NODE_ENV !== 'production') {
          console.info('.' + prop, '(handler)')
        }
        continue
      }

      this.definition[ prop ] = this.handleRpcFunction(prop)
      if (process.env.NODE_ENV !== 'production') {
        console.info('.' + prop, '(args, done)')
      }
    }

    if (typeof this.definition[ 'join' ] === 'undefined') {
      this.definition[ 'join' ] = this.joinFunction()
      if (process.env.NODE_ENV !== 'production') {
        console.info('.join', '()')
      }
    }

    if (typeof this.definition[ 'leave' ] === 'undefined') {
      this.definition[ 'leave' ] = this.leaveFunction()
      if (process.env.NODE_ENV !== 'production') {
        console.info('.leave', '()')
      }
    }
    if (process.env.NODE_ENV !== 'production') {
      console.groupEnd()
    }

    Object.defineProperty(this.socket, this.controller, {
      get: function () {
        return this.definition
      }.bind(this)
    })
  }

  isEvent (func) {
    return func.startsWith('on')
  }

  joinFunction () {
    return function () {
      this.socket.emit('join', this.controller)
      if (process.env.NODE_ENV !== 'production') {
        console.log('[WebSocket]', this.socketName + '.' + this.controller + '.join ()')
      }
      return this.definition
    }.bind(this)
  }

  leaveFunction () {
    return function () {
      this.socket.emit('leave', this.controller)
      if (process.env.NODE_ENV !== 'production') {
        console.log('[WebSocket]', this.socketName + '.' + this.controller + '.leave ()')
      }
      return this.definition
    }.bind(this)
  }

  handleEventFunction (eventName) {
    return function (handler) {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof handler !== 'function') {
          console.error('[WebSocket] callback is invalid in ', this.socketName + '.' + this.controller + '.' + eventName, '( {HERE} ), it should be FIRST parameter')
        }

        console.groupCollapsed('[WebSocket]', this.socketName + '.' + this.controller + '.' + eventName, '(...)')
        console.trace('Code Trace')
        console.groupEnd()
        this.socket.on(this.controller + '/' + eventName, function () {
          console.group('[WebSocket] (Event)', this.socketName + '.' + this.controller + '.' + eventName)
          console.dir(arguments.length === 1 ? arguments[ 0 ] : arguments)
          console.groupEnd()
          handler.apply(this.socket, arguments)
        }.bind(this))
        return this.definition
      }
      this.socket.on(this.controller + '/' + eventName, handler.bind(this.socket))
      return this.definition
    }.bind(this)
  }

  handleRpcFunction (rpcName) {
    return function (args, handler) {
      if (!Lodash.isFunction(handler)) {
        if (process.env.NODE_ENV !== 'production') {
          return new Promise(function (resolve, reject) {
            console.groupCollapsed('[WebSocket] (RPC/Promise:Call)', this.socketName + '.' + this.controller + '.' + rpcName, '()')
            console.dir(args)
            console.trace('Code Trace')
            console.groupEnd()
            this.socket.emit(this.controller + '/' + rpcName, args, function (respond) {
              console.groupCollapsed('[WebSocket] (RPC/Promise:Response)', this.socketName + '.' + this.controller + '.' + rpcName, '()')
              console.dir(respond)
              console.groupEnd()
              if (!respond.ok) {
                return reject(respond)
              }
              resolve(respond)
            }.bind(this))
          }.bind(this))
        }

        return new Promise(function (resolve, reject) {
          this.socket.emit(this.controller + '/' + rpcName, args, function (respond) {
            if (!respond.ok) {
              return reject(respond)
            }
            resolve(respond)
          })
        }.bind(this))
      }

      if (process.env.NODE_ENV !== 'production') {
        console.groupCollapsed('[WebSocket] (RPC:Call)', this.socketName + '.' + this.controller + '.' + rpcName, '()')
        console.dir(args)
        console.trace('Code Trace')
        console.groupEnd()
        this.socket.emit(this.controller + '/' + rpcName, args, function (respond) {
          console.groupCollapsed('[WebSocket] (RPC:Response)', this.socketName + '.' + this.controller + '.' + rpcName, '()')
          console.dir(arguments.length === 1 ? arguments[ 0 ] : arguments)
          console.groupEnd()
          handler.apply(this.socket, arguments)
        }.bind(this))
        return this.definition
      }
      this.socket.emit(this.controller + '/' + rpcName, args, handler.bind(this.socket))
      return this.definition
    }.bind(this)
  }
}