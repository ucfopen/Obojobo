const path = require('path')
const express = require('express')
const app = express()

// @TODO why is this here?
const fs = require('fs');
require.extensions['.svg'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

// when the parent app is mounted
app.on('mount', app => {
	//  add our static directory
	app.use(express.static(path.join(__dirname, 'public')))

	// append our view path to the configured view paths
	let viewPaths = app.get('views')
	if(!Array.isArray(viewPaths)) viewPaths = [viewPaths]
	viewPaths.push(`${__dirname}/views`)
	app.set('views', viewPaths)

	// register express-react-views template engine if not already registered
	if(!app.engines['jsx']){
		app.engine('jsx', require('./lib/express-react-views').createEngine());
	}

	// =========== ROUTING & CONTROLLERS ===========
	app.use('/api', require('./routes/api'))
	app.use('/', require('./routes/dashboard'))
	app.use('/', require('./routes/library'))
})

module.exports = app
