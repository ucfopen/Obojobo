const express = require('express')

// Load an example default Obojobo middleware
const defaultObojoboMiddleware = require('./middleware.default')

// Start a web server
const app = express()

// add the middleware to Express
defaultObojoboMiddleware(app)

module.exports = app
