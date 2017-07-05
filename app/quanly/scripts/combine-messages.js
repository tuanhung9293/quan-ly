'use strict'

const Path = require('path')
const FileSystem = interopRequireWildcard(require('fs'))
const Glob = require('glob')
const Mkdirp = require('mkdirp')
const Moment = require('moment')

function interopRequireWildcard (obj) {
  if (obj && obj.__esModule) { return obj } else {
    var newObj = {}
    if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[ key ] = obj[ key ] } }
    newObj.default = obj
    return newObj
  }
}

const MESSAGES_PATTERN = Path.join('./tmp-messages/**/*.json')

// -----------------------------------------------------------------
const Constants = require('../packages/intl/lib/constants')

const Lodash = require('lodash')
const Async = require('async')
const Config = require('../src/config')
const messagesDirectory = Path.join(Config.locales.messagesDir)
const sourceCodeLocale = Config.locales.sourceCodeLocale
const supportedLocales = Config.locales.supportedLocales
const runTimeString = Moment().format('YYYYMMDD_HHmm')

var seneca = require('../src/seneca')
seneca.ready(function () {
  Async.waterfall(
    [
      // find messages in source code
      function (done) {
        create_messages_directory_if_needed()
        done(null, find_default_messages())
      },

      // save message in source to JSON file and set to database by seneca
      // with status translated
      function (messages, done) {
        save_messages(sourceCodeLocale, messages)
        Async.mapValues(messages, function (defaultMessage, id, next) {
          seneca.act('role:intl, cmd:set', {
            message_id: id,
            default_message: defaultMessage,
            locale: sourceCodeLocale,
            status: Constants.STATUS_TRANSLATED
          }, next)
        }, function () {
          done(null, messages)
        })
      },

      // find all supported locales and merged/create it and set it to database
      // by seneca with status not-sure or not-translated
      function (messages, done) {
        Async.map(supportedLocales, function (locale, next) {
          if (locale === sourceCodeLocale) {
            return next(null)
          }

          if (!FileSystem.existsSync(get_locale_filename(locale))) {
            save_messages(locale, messages)
            return next(null)
          }

          var localeMessages = Lodash.assign({}, messages, load_messages(locale))
          Async.mapValues(localeMessages, function (defaultMessage, id, mapNext) {
            seneca.act('role:intl, cmd:set', {
              message_id: id,
              default_message: defaultMessage,
              locale: locale,
              status: defaultMessage === messages[id] ? Constants.STATUS_NOT_TRANSLATED : Constants.STATUS_NOT_SURE
            }, mapNext)
          }, function () {
            save_messages(locale, localeMessages, true)
            next(null)
          })
        }, function (err) {
          done(null)
        })
      }
    ],
    function () {
      process.exit()
    }
  )
})

/*
 var seneca = require('../src/seneca')
 for (var messageId in defaultMessages) {
 seneca.act('role:intl, cmd:add', {
 message_id: messageId,
 default_message: defaultMessages[messageId]
 })
 }
 */

function create_messages_directory_if_needed () {
  (0, Mkdirp.sync)(messagesDirectory)
}

function create_backup_directory_if_needed() {
  (0, Mkdirp.sync)(Path.join(messagesDirectory, 'backup', runTimeString))
}

function save_messages (locale, messages, isMerged) {
  console.log('----- save_messages(', locale, ')', isMerged ? 'MERGED' : '')
  FileSystem.writeFileSync(get_locale_filename(locale), JSON.stringify(messages, null, 2))
}

function get_locale_filename (locale) {
  return Path.join(messagesDirectory, locale + '.json')
}

function load_messages (locale) {
  return JSON.parse(FileSystem.readFileSync(get_locale_filename(locale), 'utf8'))
}

function find_default_messages () {
  console.log('----- find_default_messages()')
  return (0, Glob.sync)(MESSAGES_PATTERN).map(function (filename) {
    return FileSystem.readFileSync(filename, 'utf8')
  }).map(function (file) {
    return JSON.parse(file)
  }).reduce(function (collection, descriptors) {
    descriptors.forEach(function (_ref) {
      var id = _ref.id
      var defaultMessage = _ref.defaultMessage

      if (collection.hasOwnProperty(id) && collection[id] !== defaultMessage) {
        throw new Error('Duplicate message id: ' + id)
      }

      console.log(' ', id, '=', defaultMessage)
      collection[ id ] = defaultMessage
    })

    return collection
  }, {})
}


