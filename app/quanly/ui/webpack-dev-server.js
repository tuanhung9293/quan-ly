'use strict'

var Path = require('path')
var Webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var WebpackConfig = require('./webpack.dev.config')

const port = 60002

new WebpackDevServer(Webpack(WebpackConfig), {
  contentBase: Path.join(__dirname, '..', 'public'),
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true
  }
}).listen(port, function (err) {
  if (err) {
    return console.log(err)
  }

  console.log('Listening at', port)
})
