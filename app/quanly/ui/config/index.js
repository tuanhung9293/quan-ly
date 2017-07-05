'use strict'

var configs = {
  dev: require('./dev'),
  prod: require('./prod')
}

import { addLocaleData } from 'react-intl'

var appConfiguration = configs[ global.CONFIG_FILE || 'dev' ];

appConfiguration.getLocaleData = function (next) {
  fetch(global.LOCALE_FILE + '/' + global.LOCALE + '.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (messages) {
      addLocaleData({
        parentLocale: 'en',
        locale: global.LOCALE,
        messages: messages
      })
      next(null, {
        locale: global.LOCALE,
        messages: messages
      })
    })
    .catch(function (exception) {
      next(true)
    })
}

module.exports = appConfiguration
