/* Copyright (c) 2016 timugz (timugz@gmail.com) */
'use strict'

const FileSystem = require('fs')
var Path = require('path')
var Async = require('async')
var Lodash = require('lodash')
var Config = require('../config')

const supportedLocales = Config.locales.supportedLocales

module.exports = function (app) {
  app.get('/i18n/:locale.json', function(req, res) {
    res.sendFile(get_locale_filename(req.params.locale))
  })

  app.get('/i18n', function(req, res) {
    var locales = supportedLocales.reduce(function(acc, item) {
      acc[item] = []
      return acc
    }, {})
    Async.mapValues(locales, function(val, locale, next) {
      next(null, load_messages(locale))
    }, function(err, results) {
      res.json(results)
    })
  })

  app.get('*', function (req, res) {
    res.render('app.ejs')
  })

  function get_locale_filename(locale) {
    return Path.join(Config.projectRoot, 'messages', locale + '.json')
  }

  function load_messages (locale) {
    return JSON.parse(FileSystem.readFileSync(get_locale_filename(locale), 'utf8'))
  }
}
