'use strict'

import WebSocketController from '../../api/server/WebSocketController'

export default class WarehouseSocketController extends WebSocketController {
  onCreated (respond) {
    this.fireEvent('onCreated', respond.warehouse)
  }

  onUpdated (respond) {
    this.fireEvent('onUpdated', respond.warehouse)
  }

  onDeleted (respond) {
    this.fireEvent('onDeleted', respond.warehouse)
  }

  getWarehouses (input, reply) {
    var query = input || { query: { sort$: { 'name': 1 } } }
    this.senecaProxy('role:warehouse, cmd:get', query, reply)
  }

  createWarehouse (input, reply) {
    this.senecaProxy('role:warehouse, cmd:add', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onCreated(respond)
      }
    })
  }

  updateWarehouse (input, reply) {
    this.senecaProxy('role:warehouse, cmd:update', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onUpdated(respond)
      }
    })
  }

  restoreWarehouse (input, reply) {
    this.senecaProxy('role:warehouse, cmd:restore', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onCreated(respond)
      }
    })
  }

  deleteWarehouse (input, reply) {
    this.senecaProxy('role:warehouse, cmd:delete', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onDeleted(respond)
      }
    })
  }
}