'use strict'

import WebSocketController from '../../api/server/WebSocketController'

export default class AccessRightsSocket extends WebSocketController {
  onRoleCreated(respond) {
    this.fireEvent('onRoleCreated', respond.role)
  }

  onRoleUpdated(respond) {
    this.fireEvent('onRoleUpdated', respond.role)
  }

  onRoleDeleted(respond) {
    this.fireEvent('onRoleDeleted', respond.role)
  }

  getRoles (input, reply) {
    var query = input || { query: { sort$: { 'name': 1 } } }
    this.senecaProxy('role:role, cmd:get', query, reply)
  }

  createRole (input, reply) {
    this.senecaProxy('role:role, cmd:add', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onRoleCreated(respond)
      }
    })
  }

  updateRole (input, reply) {
    this.senecaProxy('role:role, cmd:update', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onRoleUpdated(respond)
      }
    })
  }

  restoreRole (input, reply) {
    this.senecaProxy('role:role, cmd:restore', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onRoleCreated(respond)
      }
    })
  }

  deleteRole (input, reply) {
    this.senecaProxy('role:role, cmd:delete', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onRoleDeleted(respond)
      }
    })
  }
}