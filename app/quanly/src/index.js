'use strict'

var Config = require('./config')
var Http = require('http')

var seneca = require('./seneca')
const app = require('./express')

const server = Http.createServer(app)
server.listen(Config.port)

seneca.act('role:demo-account, cmd:generate', function () {

})

require('./socket')(server)
