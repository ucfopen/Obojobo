let newrelic = require('newrelic')
var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var bodyParser = require('body-parser')
var session = require('express-session')
var pgSession = require('connect-pg-simple')
var app = express()
let config = require('./config')
let compression = require('compression')
let logger = require('./logger')

// =========== STATIC ASSET PATHS ================
app.use(express.static(path.join(__dirname, 'public')))
app.use(compression())

// =========== VIEW ENGINES ================
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// =========== SET UP MIDDLEWARE ================
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json(config.general.bodyParser.jsonOptions))
app.use(bodyParser.urlencoded(config.general.bodyParser.urlencodedOptions))
app.use(bodyParser.text())

app.use(
	session({
		store: new (pgSession(session))({
			conString: config.db,
			tableName: 'sessions'
		}),
		secret: config.general.cookieSecret,
		resave: false,
		name: config.general.cookieName,
		saveUninitialized: false,
		cookie: {
			path: '/',
			sameSite: false, // Seems to be blocking access from webcourses2c.instructure.com to obojobo (though not webcourses.ucf.edu?)
			httpOnly: !config.general.secureCookie,
			secure: config.general.secureCookie,
			maxAge: 10 * 24 * 60 * 60 * 1000 // 30 days
		}
	})
)

//
app.use(require('./obo_express'))

// Custom Routes
app.use('/', require('./routes/index'))
app.use('/profile', require('./routes/profile'))

// Temporary for caliper
app.use(`/static/caliperSensor.js`, express.static(`./public/caliperSensor.js`))

app.use(function(req, res, next) {
	res.status(404)
	res.render('404.pug')
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}
	logger.error(err)
	// render the error page
	res.status(err.status || 500)
	res.render('error.pug')
})

module.exports = app
