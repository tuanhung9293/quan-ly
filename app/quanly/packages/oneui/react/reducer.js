'use strict'

import * as ActionTypes from '../lib/actionTypes'

const Lodash = require('lodash')

const initialState = {
  ready: false,
  open_nav: false,
  open_side_overlay: false,
  app_name: 'App',
  page_title_template: ':title | App'
}

export default function (state = initialState, payload) {
  switch (payload.type) {
    case ActionTypes.SET_PAGE_READY:
      return Lodash.assign({}, state, {
        ready: payload.ready
      })

    case ActionTypes.CHANGE_NAV:
      return Lodash.assign({}, state, {
        open_nav: (payload.open === 'toggle') ? !state.open_nav : payload.open
      })

    case ActionTypes.CHANGE_SIDE_OVERLAY:
      return Lodash.assign({}, state, {
        open_side_overlay: (payload.open === 'toggle') ? !state.open_side_overlay : payload.open
      })

    case ActionTypes.SET_PAGE_TITLE_TEMPLATE:
      return Lodash.assign({}, state, {
        page_title_template: payload.template
      })

    default:
      return state
  }
}
