'use strict'

import * as Types from '../lib/actionTypes'
import { CompanySocket } from '../../api/CompanySocket'

var timeout = null

export function setFlashLogDisplayIn (log, second) {
  return function (dispatch) {
    dispatch(setFlashLog(log))

    clearTimeout(timeout)
    timeout = setTimeout(function () {
      dispatch(displayFlashLog(false))
    }, (second || 10) * 1000)
  }
}

export function joinRoom () {
  return function (dispatch) {
    CompanySocket.Log.join()
      .onCreated(function (log) {
        dispatch({ type: Types.LOG_CREATED, log })
      })
  }
}

export function leaveRoom () {
  return function (dispatch) {
    CompanySocket.Log.leave()
  }
}

export function setFlashLog (log) {
  return {
    type: Types.SET_FLASH_LOG,
    log: log
  }
}

export function displayFlashLog (display) {
  return {
    type: Types.DISPLAY_FLASH_LOG,
    display: display || false
  }
}

export function getLogs (offset, offsetDate) {
  return function (dispatch) {
    CompanySocket.Log.getLogs({ offset: offset || '-7 days', offsetDate: offsetDate || new Date }, function (respond) {
      dispatch({
        type: Types.SET_LOGS,
        logs: respond.logs,
        offsetDate: respond.offset_date
      })
    })
  }
}
