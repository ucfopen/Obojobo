#!/usr/bin/env node
global.oboRequire = name => {
	return require(`${__dirname}/../${name}`)
}
let fs = require('fs')
let path = require('path')
let exec = require('child_process').exec

let usageError = new Error(`Usage:
	node sample_draft.js seed
	node sample_draft.js watch`)
let defaultId = '00000000-0000-0000-0000-000000000000'
let sampleJsonPath = path.join(__dirname, '..', '..', '..', 'node_modules', 'obojobo-document-engine', 'test-object.json')
let writeJsonDraftToDbPath = `${__dirname}/write_json_draft_to_db`
let db = oboRequire('db')

try {
	if (process.argv.length <= 2) throw usageError

	switch (process.argv[2]) {
		case 'seed':
			db
				.any(
					`SELECT id
				FROM drafts
				WHERE id = $[id]`,
					{ id: defaultId }
				)
				.then(result => {
					let cmd
					if (result.length < 1) {
						cmd = `node ${writeJsonDraftToDbPath} insert ${sampleJsonPath} 0 ${defaultId}`
					} else {
						cmd = `node ${writeJsonDraftToDbPath} update ${sampleJsonPath} ${defaultId}`
					}

					exec(cmd, {}, (err, stdout, stderr) => {
						if (err) {
							throw(err)
						}

						console.log(
							`Sample draft seeded at ${defaultId}, you must set the user ID to view the sample!`
						)

						if (stdout) console.info(stdout)
						if (stderr) console.error(stderr)
						process.exit(0)
					})
				})
			break

		case 'watch':
			fs.watch(sampleJsonPath, { encoding: 'buffer' }, (eventType, filename) => {
				exec(
					`node ${writeJsonDraftToDbPath} update ${sampleJsonPath} ${defaultId}`,
					{},
					(err, stdout, stderr) => {
						if (err) {
							throw(err)
						}

						console.info('Sample JSON Draft changed, updating...')

						if (stdout) console.info(stdout)
						if (stderr) console.error(stderr)
					}
				)
			})
			break

		default:
			throw usageError
			break
	}
} catch (e) {
	console.error(e.message)
	process.exit(1)
}
