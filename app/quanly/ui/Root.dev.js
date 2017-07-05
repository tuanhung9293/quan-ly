'use strict'

import React, {Component} from 'react'
import { Provider } from 'react-redux'
import {IntlProvider} from 'react-intl'

import AppRoute from './AppRoute'

export default class Root extends Component {
  render () {
    const {store, intlData} = this.props

    return (
      <Provider store={store}>
        <IntlProvider {...intlData}>
          <div>
            <AppRoute />
          </div>
        </IntlProvider>
      </Provider>
    )
  }
}
