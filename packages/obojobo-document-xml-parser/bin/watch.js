#!/usr/bin/env node

let fs = require('fs')
let exec = require('child_process').exec

fs.watch('./examples/test-object.xml', { encoding:'buffer' }, (eventType, filename) => {
	exec('node ./bin/xml2draft.js ./examples/test-object.xml --generate-ids --spaces=2 > ./test-object.json', {}, (err, stdout, stderr) => {
		if(err) {
			console.error(err);
			return;
		}

		console.log('Sample XML changed, updating...')

		if(stdout) console.log(stdout)
		if(stderr) console.log(stderr)
	})
})
