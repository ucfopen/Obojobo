const express = require('express')

// Load an example default Obojobo middleware
const DefaultObojoboMiddleware = require('./middleware.default')

// Start a web server
const app = express()

// add the middleware to Express
DefaultObojoboMiddleware(app)

module.exports = app
