'use strict'

var assign = require('lodash').assign
const ProductionConfig = require('./config.prod')

const config = {
  url: 'http://localhost:60001',
  devPort: 60002,
  devUrl: 'http://localhost:60002',
  assetsRoot: 'http://localhost:60001',
  uiConfigFile: 'dev'
}

module.exports = assign({}, ProductionConfig, config, {
  jsRoot: config.devUrl
})
