#!/usr/bin/env node

/* eslint-disable no-console */

global.oboRequire = name => {
	return require(`${__dirname}/../${name}`)
}
const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec

const usageError = new Error(`Usage:
	node tutorial_draft.js seed
	node tutorial_draft.js watch`)
const defaultId = '11111111-1111-1111-1111-111111111111'
const tutorialJsonPath = path.join(
	__dirname,
	'..',
	'..',
	'..',
	'node_modules',
	'obojobo-document-engine',
	'src',
	'scripts',
	'oboeditor',
	'documents',
	'oboeditor-tutorial.json'
)
const writeJsonDraftToDbPath = `${__dirname}/write_json_draft_to_db`
const db = oboRequire('db')

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
						cmd = `node ${writeJsonDraftToDbPath} insert ${tutorialJsonPath} 0 ${defaultId}`
					} else {
						cmd = `node ${writeJsonDraftToDbPath} update ${tutorialJsonPath} ${defaultId}`
					}

					exec(cmd, {}, (err, stdout, stderr) => {
						if (err) {
							console.error(err.message)
							throw err
						}

						console.log(
							`Tutorial draft seeded at ${defaultId}, you must set the user ID to view the tutorial!`
						)

						if (stdout) console.info(stdout)
						if (stderr) console.error(stderr)
						process.exit(0)
					})
				})
			break

		case 'watch':
			fs.watch(tutorialJsonPath, { encoding: 'buffer' }, () => {
				exec(
					`node ${writeJsonDraftToDbPath} update ${tutorialJsonPath} ${defaultId}`,
					{},
					(err, stdout, stderr) => {
						if (err) {
							console.error(err.message)
							return
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
	}
} catch (e) {
	console.error(e.message)
	process.exit(1)
}
