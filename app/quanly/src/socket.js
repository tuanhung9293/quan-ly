'use strict'

import WarehouseSocketController from '../packages/warehouse/server/WarehouseSocketController'
import EmployeeSocketController from '../packages/employee/server/EmployeeSocketController'
import LogSocketController from '../packages/log/server/LogSocketController'
import AccessRightsSocketController from '../packages/access-rights/server/AccessRightsSocketController'
import SupplierSocketController from '../packages/supplier/server/SupplierSocketController'
const Lodash = require('lodash')
const seneca = require('./seneca')

module.exports = function (server) {
  var io = require('socket.io')(server)

  seneca.add('role:websocket, cmd:broadcast', function (args, done) {
    if (typeof args.eventName === 'undefined' || args.data === 'undefined') {
      return done(null, { ok: false })
    }

    if (typeof args.room === 'undefined') {
      io.emit(args.eventName, args.data)
    } else {
      io.to(args.room).emit(args.eventName, args.data)
    }
    done(null, { ok: true })
  })

  io.use(function (socket, next) {
    // fake company & user for now
    socket.handshake.company = 'default'
    socket.handshake.user = {
      id: 1,
      email: 'nhat.phan@ntworld.net'
    }
    next()
  })

  io.on('connect', function (socket) {
    socket
      .on('join', function (room, reply) {
        socket.join(room)
        if (Lodash.isFunction(reply)) {
          reply({ ok: true })
        }
      })
      .on('leave', function (room, reply) {
        socket.leave(room)
        if (Lodash.isFunction(reply)) {
          reply({ ok: true })
        }
      });

    (new WarehouseSocketController('Warehouse', socket, seneca, io)).onConnected();
    (new EmployeeSocketController('Employee', socket, seneca, io)).onConnected();
    (new LogSocketController('Log', socket, seneca, io)).onConnected();
    (new AccessRightsSocketController('AccessRights', socket, seneca, io)).onConnected();
    (new SupplierSocketController('Supplier', socket, seneca, io)).onConnected();
    socket.emit('System.onReady')
  })
}
