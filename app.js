let newrelic = require('newrelic')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var session = require('express-session')
var pgSession = require('connect-pg-simple')
var app = express();
let config = require('./config')
let oboRequire = require('./obo_require')

// Global for loading specialized Obojobo stuff
// use oboRequire('models/draft') to load draft models from any context
global.oboRequire = oboRequire

let obojoboDraftExpress = require('./obojobo_draft_express');

// =========== STATIC ASSET PATHS ================
app.use(express.static(path.join(__dirname, 'public')));

// =========== VIEW ENGINES ================
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

// =========== SET UP MIDDLEWARE ================
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json(config.general.bodyParser.jsonOptions));
app.use(bodyParser.urlencoded(config.general.bodyParser.urlencodedOptions));

app.use(session({
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
}))

app.use(require('node-sass-middleware')({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: true,
	sourceMap: true
}));

app.use(obojoboDraftExpress)

// @TODO 404!

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	console.error(err)
	// render the error page
	res.status(err.status || 500);
	res.render('error.pug');
	next()
});

// @TODO: centralize logging
app.logError = function(name, req, ...additional) {
	console.error("ERROR:", name, "\n", (new Date()), "\nREQUEST HEADERS", req.headers, "\nREQUEST BODY", req.body);
	if(typeof additional !== "undefined")
	{
		console.error(additional);
	}
	console.error("");
}

module.exports = app;
