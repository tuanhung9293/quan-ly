'use strict'

if (process.env.NODE_ENV === 'development') {
  require('webpack-dev-server/client?http://localhost:60002')
  require('webpack/hot/only-dev-server')
  require('react-hot-loader/patch')
}

module.exports = {
  api: 'http://api.dev.quan-ly.com',
}
