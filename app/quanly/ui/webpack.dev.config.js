'use strict'

var Path = require('path')
var Webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: {
    bundle: Path.join(__dirname, 'index'),
  },
  output: {
    path: Path.join(__dirname, '..', 'src', 'public', 'js'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          Path.resolve(__dirname),
          Path.resolve(__dirname, '..', 'packages')
        ],
        loader: 'babel-loader',
        query: {
          presets: [ [ "es2015", { "loose": true } ], 'stage-0', 'react' ],
          plugins: [
            "react-hot-loader/babel"
          ]
        },
      }
    ]
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        PLATFORM_ENV: JSON.stringify('web'),
      },
    }),
    new Webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    alias: {
      'packages': Path.join(__dirname, '..', 'packages'),
      'redux-devtools/lib': Path.join(__dirname, '..', 'node_modules', 'redux-devtools', 'lib'),
      'redux-devtools': Path.join(__dirname, '..', 'node_modules', 'redux-devtools'),
      'react': Path.join(__dirname, '..', 'node_modules', 'react')
    },
    extensions: [ '', '.js', '.jsx' ]
  },
  resolveLoader: {
    'fallback': Path.join(__dirname, '..', 'node_modules')
  }
}
