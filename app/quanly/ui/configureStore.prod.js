'use strict'

import { createStore, applyMiddleware } from 'redux'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { routerMiddleware } from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './rootReducer'

const routerMiddlewareInstance = routerMiddleware(browserHistory)

var routerHistory

export default function configureStore (initialState) {
  const store = createStore(rootReducer, initialState, applyMiddleware(
    thunkMiddleware, routerMiddlewareInstance
  ))
  routerHistory = syncHistoryWithStore(browserHistory, store)

  return store
}

export function getRouterHistory () {
  return routerHistory
}
