'use strict'

import * as ActionTypes from '../lib/actionTypes'

const Lodash = require('lodash')
const Moment = require('moment')
import { fromJS, List, Map } from 'immutable'

const initialState = {
  logs: null,
  offset_date: null,

  flash_log: null,
  display_flash_log: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SET_FLASH_LOG:
      return Lodash.assign({}, state, {
        flash_log: action.log,
        display_flash_log: true
      })

    case ActionTypes.DISPLAY_FLASH_LOG:
      return Lodash.assign({}, state, {
        display_flash_log: action.display
      })

    case ActionTypes.LOG_CREATED:
      var date = Moment(action.log.created_at).format('YYYY-MM-DD')
      var logs = state.logs
      if (logs.has(date)) {
        logs = logs.set(date, logs.get(date).unshift(action.log))
      } else if (logs !== null) {
        logs = logs.set(date, List([ action.log ]))
      } else {
        logs = fromJS({ [date]: [ action.log ] })
      }
      return Lodash.assign({}, state, {
        logs: logs
      })

    case ActionTypes.SET_LOGS:
      var logs = {}
      for (var i = 0, l = action.logs.length; i < l; i++) {
        var date = Moment(action.logs[ i ].created_at).format('YYYY-MM-DD')
        if (typeof logs[ date ] === 'undefined') {
          logs[ date ] = []
        }
        logs[ date ].push(action.logs[ i ])
      }
      return Lodash.assign({}, state, {
        logs: fromJS(logs),
        offset_date: Moment(action.offset_date)
      })

    default:
      return state
  }
}
