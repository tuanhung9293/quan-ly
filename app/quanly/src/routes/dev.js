/* Copyright (c) 2016 timugz (timugz@gmail.com) */
'use strict'

var Config = require('../config')

module.exports = function (app) {
  if (Config.env === 'development') {
    var redirectToWebpack = function (req, res) {
      var index = req.originalUrl.lastIndexOf('/')
      if (index !== -1) {
        res.redirect(301, Config.devUrl + req.originalUrl.substr(index))
      } else {
        res.redirect(301, Config.devUrl + req.originalUrl)
      }
    }

    var folders = [
      '',
      '/stock',
      '/configuration'
    ]

    for (var i = 0, l = folders.length; i < l; i++) {
      app.get(folders[ i ] + '/*.hot-update.js', redirectToWebpack)
      app.get(folders[ i ] + '/*.hot-update.json', redirectToWebpack)
    }
  }
}
