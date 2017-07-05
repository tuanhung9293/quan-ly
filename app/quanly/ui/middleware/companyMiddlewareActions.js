/* Copyright (c) 2016 timugz (timugz@gmail.com) */
'use strict'

import { CompanySocket, connect, disconnect } from 'packages/api/CompanySocket'
import { setPageReady } from 'packages/oneui'

var isDead = false

export function start (token) {
  return function (dispatch) {
    dispatch(setPageReady(false))
    connect(token, function () {
      dispatch(setPageReady(true))

      isDead = false
      CompanySocket.on('disconnect', function () {
        if (isDead === false) {
          // dispatch(displayPageLoader(true))
        }
      })
    })
  }
}

export function stop () {
  return function (dispatch) {
    isDead = true
    disconnect()
  }
}
