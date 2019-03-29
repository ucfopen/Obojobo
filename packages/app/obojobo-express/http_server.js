var http = require('http')

/**
 * This code is derived from bin/www used in Express 4
 * We extracted the code from that file to make it 1: testable
 * and 2: easier to manipulate for customizing Obojobo.
 * Now you can build your own express app, add middleware, and
 * pass it to startServer to start your app
 */

const normalizePort = val => {
	var port = parseInt(val, 10)

	if (isNaN(port)) {
		// named pipe
		return val
	}

	if (port >= 0) {
		// port number
		return port
	}

	return false
}

const startServer = (app, logger, port = '3000') => {
	console.log('Note: Logging and config options can be set using environment variables.')

	port = normalizePort(port)
	app.set('port', port)
	const server = http.createServer(app)

	server.on('error', error => {
		if (error.syscall !== 'listen') {
			throw error
		}

		var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

		// handle specific listen errors with friendly messages
		switch (error.code) {
			case 'EACCES':
				logger.error(bind + ' requires elevated privileges')
				process.exit(1)
				break

			case 'EADDRINUSE':
				logger.error(bind + ' is already in use')
				process.exit(1)
				break

			default:
				throw error
		}
	})

	server.on('listening', () => {
		let addr = server.address()
		const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
		logger.info('Listening on ' + bind)
	})

	/**
	 * Listen on provided port, on all network interfaces.
	 */
	server.listen(port)

	return server
}

module.exports = startServer
