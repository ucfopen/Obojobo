const express = require('express')

// Load an example default Obojobo middleware
let DefaultObojoboMiddleware = require('./middleware.default')

// Start a web server
const app = express()

// add the middleware to Express
app.use(DefaultObojoboMiddleware)
