#!/usr/bin/env node
global.oboRequire = name => require(`${__dirname}/../${name}`)
const fs = require('fs')
const db = oboRequire('db')
const DraftModel = oboRequire('models/draft')
const usageError = new Error(`Usage:
	node write_json_draft_to_db.js insert file.json [user_id] [draft_id]
	node write_json_draft_to_db.js update file.json draft_id`)

try {
	let desiredDraftId
	let userId
	let generatedDraftId

	if (process.argv.length <= 2) throw usageError

	const insertOrUpdate = process.argv[2]
	const jsonFilePath = process.argv[3]
	let contentFile = fs.readFileSync(jsonFilePath)
	let jsonContent = JSON.parse(contentFile)

	switch (insertOrUpdate) {
		case 'insert':
			userId = process.argv[4] || 0
			desiredDraftId = process.argv[5] || null

			DraftModel.createWithContent(userId, jsonContent)
				.then(newDraft => {
					if (desiredDraftId) {
						console.info(desiredDraftId)
						generatedDraftId = newDraft.id
						return db.tx('Update if given id', t => {
							return t.batch([
								t.none(
									`UPDATE drafts
									SET id = $[newId]
									WHERE id = $[currentId]`,
									{ newId: desiredDraftId, currentId: generatedDraftId }
								),
								t.none(
									`UPDATE drafts_content
									SET draft_id = $[newId]
									WHERE draft_id = $[currentId]`,
									{ newId: desiredDraftId, currentId: generatedDraftId }
								)
							])
						})
					}
					console.info(newDraft.id)
					return newDraft
				})
				.then(() => {
					process.exit()
					return
				})
				.catch(err => {
					console.error(err.message)
					process.exit(1)
					return
				})
			break

		case 'update':
			draftId = process.argv[4] || 0

			Draft.updateContent(draftId, json)
				.then(id => {
					console.info('OK. id=' + id)
					process.exit()
					return
				})
				.catch(err => {
					console.error(err.message)
					process.exit(1)
					return
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
