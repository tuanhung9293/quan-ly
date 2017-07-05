'use strict'

import WebSocketController from '../../api/server/WebSocketController'

export default class SupplierSocketController extends WebSocketController {
  onSupplierCreated (respond) {
    this.fireEvent('onSupplierCreated', respond.supplier)
  }

  onSupplierUpdated (respond) {
    this.fireEvent('onSupplierUpdated', respond.supplier)
  }

  onSupplierDeleted (respond) {
    this.fireEvent('onSupplierDeleted', respond.supplier)
  }

  onSupplierUnassigned(respond){
    this.fireEvent('onSupplierUnassigned', respond.supplier_id)
  }

  getSuppliers (input, reply) {
    var query = input || { query: { sort$: { 'name': 1 } } }
    this.senecaProxy('role:supplier, cmd:get', query, reply)
  }

  createSupplier (input, reply) {
    this.senecaProxy('role:supplier, cmd:add', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onSupplierCreated(respond)
      }
    })
  }

  updateSupplier (input, reply) {
    this.senecaProxy('role:supplier, cmd:update', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onSupplierUpdated(respond)
      }
    })
  }

  restoreSupplier (input, reply) {
    this.senecaProxy('role:supplier, cmd:restore', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onSupplierCreated(respond)
      }
    })
  }

  deleteSupplier (input, reply) {
    this.senecaProxy('role:supplier, cmd:delete', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onSupplierDeleted(respond)
      }
    })
  }

  unassignSupplier (input, reply) {
    this.senecaProxy('role:supplier, cmd:unassign', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onSupplierUnassigned(respond)
      }
    })
  }

  onGroupCreated (respond) {
    this.fireEvent('onGroupCreated', respond.supplier_group)
  }

  onGroupUpdated (respond) {
    this.fireEvent('onGroupUpdated', respond.supplier_group)
  }

  onGroupDeleted (respond) {
    this.fireEvent('onGroupDeleted', respond.supplier_group)
  }

  getGroups (input, reply) {
    var query = input || { query: { sort$: { 'name': 1 } } }
    this.senecaProxy('role:supplier, cmd:get-group', query, reply)
  }

  createGroup (input, reply) {
    this.senecaProxy('role:supplier, cmd:add-group', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onGroupCreated(respond)
      }
    })
  }

  updateGroup (input, reply) {
    this.senecaProxy('role:supplier, cmd:update-group', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onGroupUpdated(respond)
      }
    })
  }

  restoreGroup (input, reply) {
    this.senecaProxy('role:supplier, cmd:restore-group', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onGroupCreated(respond)
      }
    })
  }

  deleteGroup (input, reply) {
    this.senecaProxy('role:supplier, cmd:delete-group', input, reply, (respond) => {
      reply(respond)

      if (respond.ok) {
        this.onGroupDeleted(respond)
      }
    })
  }
}