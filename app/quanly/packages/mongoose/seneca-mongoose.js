'use strict'

const Mongoose = require('mongoose')
const Bluebird = require('bluebird')

const defaultOptions = {
  uri: 'mongodb://127.0.0.1:27017'
}

module.exports = function (options) {
  const seneca = this
  const opts = seneca.util.deepextend(defaultOptions, options)

  seneca.add({ init: 'mongoose' }, function (args, done) {
    Mongoose.connect(opts.uri)
    Mongoose.Promise = Bluebird
    Mongoose.connection.once('open', function () {
      seneca.decorate('mongoose', Mongoose)
      done()
    })
  })

  return 'mongoose'
}
