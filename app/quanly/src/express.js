'use strict'

var Path = require('path')
var Express = require('express')
var BodyParser = require('body-parser')
var Session = require('express-session')
var CookieParser = require('cookie-parser')
var CORS = require('cors')
var Config = require('./config')

const app = Express()

app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }));
app.use(CookieParser())

app.use(Session({
  secret: Config.session_secret,
  resave: true,
  saveUninitialized: true,
  cookie: { domain: Config.session_domain },
}))

app.set('view engine', 'ejs')
app.set('views', Path.join(Config.projectRoot, 'src', 'views'))
app.use(Express.static(Path.join(Config.projectRoot, 'src', 'public')))

app.use("/OneUI", Express.static(Path.join(Config.projectRoot, 'packages/oneui/public')))

app.use(CORS());

require('./routes')(app)

module.exports = app
