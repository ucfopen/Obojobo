// load env & secrets before starting express
require('./preload-env')

// start our own express app
const app = require('express')()
// include the default middleware
const obojoboMiddleware = require('obojobo-express/server/middleware.default')
// provide our own logger
const logger = require('obojobo-express/server/logger')

// add the middleware to Express
obojoboMiddleware(app)

// start the server
const startServer = require('obojobo-express/server/http_server.js')
const server = startServer(app, logger, process.env.PORT)

// Add some process signal handling for more graceful Docker/PM2 handling
// TODO - may need to incorperate into obojobo itself to close db connections, etc

// The process signals we want to handle
// SIGKILL (9) cannot be intercepted and handled
var signals = {
	'SIGHUP': 1,
	'SIGINT': 2,
	'SIGTERM': 15
};

// Do any necessary shutdown logic for our application here
const shutdown = (signal, value) => {
	console.log("shutdown!");
	server.close(() => {
		console.log(`server stopped by ${signal} with value ${value}`)
		process.exit(128 + value)
	})

	// If server hasn't finished in 1000ms, shut down process
	setTimeout(() => {
		console.log('server shutdown timeout reached')
		process.exit(0)
	}, 1000).unref() // Prevents the timeout from registering on event loop
}

  // Create a listener for each of the signals that we want to handle
Object.keys(signals).forEach(signal => {
	process.on(signal, () => {
		console.log(`process received a ${signal} signal`)
		shutdown(signal, signals[signal])
	})
})
