'use strict'

module.exports = {
  projectRoot: process.env.PROJECT_ROOT || '/code',
  env: process.env.NODE_ENV,
  port: 60001,
  session_secret: "449559d0eb001b14e641fc3255962c7b398555e6",
  session_domain: ".quan-ly.com",
  seneca: {},

  mongodb: {
    uri: (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017') + '/quanly_' + process.env.COMPANY
  },

  sentry: {
    dns: 'https://d3d697fc135f467381941b8e9149e72e:a3072787b45540d1833c7da9f68d0518@sentry.io/154537',
    dns_public: 'https://d3d697fc135f467381941b8e9149e72e@sentry.io/154537',
  },

  url: process.env.URL || 'http://dongtay.quan-ly.com',
  version: process.env.APP_VERSION || '0.1.0',

  locales: {
    messagesDir: './messages/', // . = PROJECT_ROOT not HERE
    sourceCodeLocale: 'en',
    defaultLocale: process.env.DEFAULT_LOCALE || 'vi-VN',
    supportedLocales: [ 'en-US', 'vi-VN' ],
    root: '/i18n',
    builder: {
      backup: true,
      autoRemoveDeletedMessages: true
    }
  },

  jsRoot: '/js',
  assetsRoot: '',
  uiConfigFile: 'prod',
}
