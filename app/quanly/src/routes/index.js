'use strict'

var Config = require('../config')

module.exports = function (app) {
  app.locals = {
    version: Config.version,
    env: Config.env,
    defaultLocale: Config.locales.defaultLocale,
    localeRoot: Config.locales.root,
    assetsRoot: Config.assetsRoot,
    jsRoot: Config.jsRoot,
    uiConfigFile: Config.uiConfigFile,
    theme: 'passion'
  }

  require('./dev')(app)
  require('./pages')(app)
}
