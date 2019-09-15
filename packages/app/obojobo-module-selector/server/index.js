const path = require('path')
const express = require('express')
const app = express()

app.on('mount', app => {
	// ============= STATIC RESOURCES ===================
	//  add this package's static directory
	app.use(express.static(path.join(__dirname, 'public')))

	// ============= VEIW & TEMPLATE SETUP ==============
	// append our view path to the configured view paths
	let viewPaths = app.get('views')
	if (!Array.isArray(viewPaths)) viewPaths = [viewPaths]
	viewPaths.push(`${__dirname}/views`)
	app.set('views', viewPaths)

	// =========== ROUTING & CONTROLLERS ===========
	app.use('/lti', require('./routes/module-selection'))
})

module.exports = app
