'use strict'

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import configureStore from './configureStore'
import Root from './Root'

const store = configureStore()
var intlData = {}

require('./config').getLocaleData(function (err, localeData) {
  if (!err) {
    intlData = localeData
  }

  render(
    <AppContainer>
      <Root store={store} intlData={intlData} />
    </AppContainer>,
    document.getElementById('root')
  )
})

if (module.hot) {
  module.hot.accept('./Root', () => {
    var NextRoot = require('./Root').default

    render(
      <AppContainer>
        <NextRoot store={store} intlData={intlData}/>
      </AppContainer>,
      document.getElementById('root')
    )
  })
}
