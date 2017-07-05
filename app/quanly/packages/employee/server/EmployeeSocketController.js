'use strict'

import WebSocketController from '../../api/server/WebSocketController'

export default class EmployeeSocketController extends WebSocketController {
  onCreated(respond) {
    this.fireEvent('onCreated', respond.employee)
  }

  onUpdated(respond) {
    this.fireEvent('onUpdated', respond.employee)
  }

  onDeleted(respond) {
    this.fireEvent('onDeleted', respond.employee)
  }

  getEmployees (input, reply) {
    var query = input || { query: { sort$: { 'name': 1 } } }
    this.senecaProxy('role:employee, cmd:get', query, reply)
  }

  createEmployee (input, reply) {
    this.senecaProxy('role:employee, cmd:add', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onCreated(respond)
      }
    })
  }

  updateEmployee (input, reply) {
    this.senecaProxy('role:employee, cmd:update', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onUpdated(respond)
      }
    })
  }

  restoreEmployee (input, reply) {
    this.senecaProxy('role:employee, cmd:restore', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onCreated(respond)
      }
    })
  }

  deleteEmployee (input, reply) {
    this.senecaProxy('role:employee, cmd:delete', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onDeleted(respond)
      }
    })
  }
}