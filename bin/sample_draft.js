#!/usr/bin/env node

let fs = require('fs')
let exec = require('child_process').exec

let usageError = new Error(`Usage:
	node sample_draft.js seed
	node sample_draft.js watch`
)

global.oboRequire = require('../obo_require')
let oboPath = oboRequire('obo_path')
let sampleJsonPath = oboPath.expandDraftPath('test-object.json')
let writeJsonDraftToDbPath = oboPath.expand('bin/write_json_draft_to_db')

try
{
	if(process.argv.length <= 2) throw usageError
	
	switch(process.argv[2])
	{
		case 'seed':
			exec('node ' + writeJsonDraftToDbPath + ' insert ' + sampleJsonPath + ' 0 00000000-0000-0000-0000-000000000000', {}, (err, stdout, stderr) => {
				if(err) {
					console.error(err.message);
					process.exit(1)
				}

				console.log('Sample draft seeded at 00000000-0000-0000-0000-000000000000, you must set the user ID to view the sample!')

				if(stdout) console.log(stdout)
				if(stderr) console.log(stderr)
				process.exit(0);
			})
			break;
		
		case 'watch':
			fs.watch(sampleJsonPath, { encoding:'buffer' }, (eventType, filename) => {
				exec('node ' + writeJsonDraftToDbPath + ' update ' + sampleJsonPath + ' 00000000-0000-0000-0000-000000000000', {}, (err, stdout, stderr) => {
					if(err) {
						console.error(err.message);
						process.exit(1)
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
catch(e)
{
	console.error(e.message);
	process.exit(1);
}