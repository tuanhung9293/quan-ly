'use strict'

import { createStore, compose, applyMiddleware } from 'redux'
import { persistState } from 'redux-devtools'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import reduxCatch from 'redux-catch'
import errorHandler from './errorHandler'
import rootReducer from './rootReducer'
import DevTools from './DevTools'

import { routerMiddleware } from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'

const routerMiddlewareInstance = routerMiddleware(browserHistory)

var enhancer
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancer = compose(
    applyMiddleware(thunkMiddleware, routerMiddlewareInstance),
    window.__REDUX_DEVTOOLS_EXTENSION__()
  )
} else {
  enhancer = compose(
    applyMiddleware(reduxCatch(errorHandler), thunkMiddleware, routerMiddlewareInstance),
    DevTools.instrument(),
    persistState(
      window.location.href.match(
        /[?&]debug_session=([^&#]+)\b/
      )
    )
  )
}

var routerHistory
export default function configureStore (initialState) {
  const store = createStore(rootReducer, initialState, enhancer)
  routerHistory = syncHistoryWithStore(browserHistory, store)

  if (module.hot) {
    module.hot.accept('./rootReducer', () =>
      store.replaceReducer(require('./rootReducer').default)
    )
  }

  return store
}

export function getRouterHistory () {
  return routerHistory
}
