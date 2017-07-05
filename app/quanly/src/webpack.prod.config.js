var Webpack = require('webpack');
var Path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return [ '.bin' ].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[ mod ] = 'commonjs ' + mod;
  });

module.exports = {
  entry: Path.join(__dirname, 'index.js'),
  target: 'node',
  output: {
    path: Path.join(__dirname, '..', 'build'),
    filename: 'main.js'
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
          presets: [ [ "es2015", { "loose": true } ], 'stage-0' ]
        },
      }
    ]
  },
  externals: nodeModules,
  plugins: [
    new Webpack.IgnorePlugin(/\.(css|less)$/),
    new Webpack.BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false }),
    new Webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ],
  devtool: 'sourcemap'
}
