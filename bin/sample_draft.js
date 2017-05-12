#!/usr/bin/env node
global.oboRequire = (name) => {return require(`${__dirname}/../${name}`)}
let fs = require('fs')
let exec = require('child_process').exec

let usageError = new Error(`Usage:
	node sample_draft.js seed
	node sample_draft.js watch`
)
let defaultId = '00000000-0000-0000-0000-000000000000'
let oboPath = oboRequire('obo_path')
let sampleJsonPath = oboPath.expandDraftPath('test-object.json')
let writeJsonDraftToDbPath = `${__dirname}/write_json_draft_to_db`

try{
	if(process.argv.length <= 2) throw usageError

	switch(process.argv[2]){
		case 'seed':
			exec(`node ${writeJsonDraftToDbPath} insert ${sampleJsonPath} 0 ${defaultId}`, {}, (err, stdout, stderr) => {
				if(err) {
					console.error(err.message);
					process.exit(1)
				}

				console.log(`Sample draft seeded at ${defaultId}, you must set the user ID to view the sample!`)

				if(stdout) console.log(stdout)
				if(stderr) console.log(stderr)
				process.exit(0);
			})
			break;

		case 'watch':
			fs.watch(sampleJsonPath, { encoding:'buffer' }, (eventType, filename) => {
				exec(`node ${writeJsonDraftToDbPath} update ${sampleJsonPath} ${defaultId}`, {}, (err, stdout, stderr) => {
					if(err) {
						console.error(err.message);
						return;
					}

					console.log('Sample JSON Draft changed, updating...')

					if(stdout) console.log(stdout)
					if(stderr) console.log(stderr)
				})
			})
			break;

		default:
			throw usageError
			break
	}
}
catch(e){
	console.error(e.message);
	process.exit(1);
}
