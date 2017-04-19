#!/usr/bin/env node

let fs = require('fs')
let exec = require('child_process').exec


fs.watch('./test-object.xml', { encoding:'buffer' }, (eventType, filename) => {
	exec('node ./bin/xml2draft.js test-object.xml --generate-ids > ../obojobo-3-node/devsrc/obojobo-draft-document-engine/test-object.json', {}, (err, stdout, stderr) => {
		if(err) {
			console.error(err.message);
			return;
		}

		console.log('Sample XML changed, updating...')

		if(stdout) console.log(stdout)
		if(stderr) console.log(stderr)
	})
})
