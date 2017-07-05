'use strict'

import React, {Component} from 'react'
import {Provider} from 'react-redux'
import AppRoute from './AppRoute'

var IntlProvider = require('react-intl').IntlProvider

export default class Root extends Component {
  render () {
    const {store, intlData} = this.props

    return (
      <Provider store={store}>
        <IntlProvider {...intlData}>
          <AppRoute />
        </IntlProvider>
      </Provider>
    )
  }
}
