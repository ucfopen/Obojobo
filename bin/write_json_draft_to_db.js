#!/usr/bin/env node
global.oboRequire = (name) => {return require(`${__dirname}/../${name}`)}
let fs = require('fs')
let logger = oboRequire('logger')

let usageError = new Error(`Usage:
	node write_json_draft_to_db.js insert file.json [user_id] [draft_id]
	node write_json_draft_to_db.js update file.json draft_id`
)

let db = oboRequire('db')
let insertNewDraft = oboRequire('routes/api/drafts/insert_new_draft')
let updateDraft = oboRequire('routes/api/drafts/update_draft')

let draftId, userId

try{
	if(process.argv.length <= 2) throw usageError

	let fn = process.argv[2]
	let jsonFilePath = process.argv[3]

	let file = fs.readFileSync(jsonFilePath)
	let json = JSON.parse(file)

	switch(fn){
		case 'insert':
			userId = process.argv[4] || 0
			draftId = process.argv[5] || null

			insertNewDraft(userId, json)
			.then(newDraft => {
				return db.one(`
					UPDATE drafts
					SET id = $[newId]
					WHERE id = $[currentId]
					`, {newId: draftId, currentId: newDraft.id}
				)
			})
			.then(()=>{
				logger.debug('OK');
				process.exit()
				return
			})
			.catch(err => {
				logger.error(err.message)
				process.exit(1)
				return
			})
			break;

		case 'update':
			draftId = process.argv[4] || 0

			updateDraft(draftId, json)
			.then(id => {
				logger.debug('OK. id=' + id)
				process.exit()
				return
			})
			.catch(err => {
				logger.error(err.message)
				process.exit(1)
				return
			})
			break;

		default:
			throw usageError
			break
	}
}
catch(e){
	logger.error('erroror')
	logger.error(e.message);
	process.exit(1);
}
