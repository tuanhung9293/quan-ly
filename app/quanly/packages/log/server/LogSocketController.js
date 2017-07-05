'use strict'

import WebSocketController from '../../api/server/WebSocketController'

export default class LogSocketController extends WebSocketController {
  getLogs (input, reply) {
    this.senecaProxy('role:log, cmd:get', input, reply)
  }

  onCreated(log) {
    this.fireEvent('onCreated', log)
  }
}