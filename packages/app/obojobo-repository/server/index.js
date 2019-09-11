const path = require('path')
const express = require('express')
const app = express()

app.on('mount', app => {
	//  add our static directory
	app.use(express.static(path.join(__dirname, 'public')))

	// append our view path to the configured view paths
	let viewPaths = app.get('views')
	if(!Array.isArray(viewPaths)) viewPaths = [viewPaths]
	viewPaths.push(path.resolve(`${__dirname}/../shared/components`)) // add the components dir so babel can transpile the jsx
	app.set('views', viewPaths)

	// register express-react-views template engine if not already registered
	if(!app.engines['jsx']){
		app.engine('jsx', require('express-react-views-custom').createEngine());
	}

	// =========== ROUTING & CONTROLLERS ===========
	app.use('/api', require('./routes/api'))
	app.use('/', require('./routes/dashboard'))
	app.use('/', require('./routes/library'))

	// register the event listeners
	require('./events')
})

module.exports = app
