#!/usr/bin/env node
global.oboRequire = name => {
	return require(`${__dirname}/../${name}`)
}
let fs = require('fs')

let usageError = new Error(`Usage:
	node write_json_draft_to_db.js insert file.json [user_id] [draft_id]
	node write_json_draft_to_db.js update file.json draft_id`)

let db = oboRequire('db')
let insertNewDraft = oboRequire('routes/api/drafts/insert_new_draft')
let updateDraft = oboRequire('routes/api/drafts/update_draft')

let draftId
let userId
let generatedDraftId

try {
	if (process.argv.length <= 2) throw usageError

	let fn = process.argv[2]
	let jsonFilePath = process.argv[3]

	let file = fs.readFileSync(jsonFilePath)
	let json = JSON.parse(file)

	switch (fn) {
		case 'insert':
			userId = process.argv[4] || 0
			draftId = process.argv[5] || null

			insertNewDraft(userId, json)
				.then(newDraft => {
					if (draftId) {
						console.info(draftId)
						generatedDraftId = newDraft.id
						return db.tx('Update if given id', t => {
							return t.batch([
								t.none(
									`UPDATE drafts
									SET id = $[newId]
									WHERE id = $[currentId]`,
									{ newId: draftId, currentId: generatedDraftId }
								),
								t.none(
									`UPDATE drafts_content
									SET draft_id = $[newId]
									WHERE draft_id = $[currentId]`,
									{ newId: draftId, currentId: generatedDraftId }
								)
							])
						})
					}
					console.info(newDraft.id)
					return newDraft
				})
				.then(() => {
					process.exit()
				})
				.catch(err => {
					console.error(err.message)
					process.exit(1)
				})
			break

		case 'update':
			draftId = process.argv[4] || 0

			updateDraft(draftId, json)
				.then(id => {
					console.info('OK. id=' + id)
					process.exit()
				})
				.catch(err => {
					console.error(err.message)
					process.exit(1)
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
