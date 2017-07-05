'use strict'

import io from 'socket.io-client'
import SocketControllerRegistry from './SocketControllerRegistry'

const url = '/'
var controllerDefined = {}

export let CompanySocket

export function connect (token, ready) {
  CompanySocket = io.connect(url)

  CompanySocket.on('connect', function () {
    if (process.env.NODE_ENV !== 'production') {
      global.CompanySocket = CompanySocket
    }

    // ServerSocket.emit('authorization', { token: token })
  })

  CompanySocket.on('System.onControllerDefined', function (data) {
    if (typeof controllerDefined[ data.controller ] === 'undefined') {
      controllerDefined[ data.controller ] = new SocketControllerRegistry(this, data, 'CompanySocket')
    }
  })

  CompanySocket.on('System.onReady', function () {
    ready()
  })
}

export function disconnect () {
  CompanySocket.emit('disconnect')
}
