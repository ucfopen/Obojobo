#!/usr/bin/env node

let fs = require('fs')

let usageError = new Error(`Usage:
	node write_json_draft_to_db.js insert file.json [user_id] [draft_id]
	node write_json_draft_to_db.js update file.json draft_id`
)

global.oboRequire = require('../obo_require')
let db = oboRequire('db')
let insertNewDraft = oboRequire('routes/api/drafts/insert_new_draft')
let updateDraft = oboRequire('routes/api/drafts/update_draft')

let draftId, userId

try
{
	if(process.argv.length <= 2) throw usageError
	
	let fn = process.argv[2]
	let jsonFilePath = process.argv[3]

	let file = fs.readFileSync(jsonFilePath)
	let json = JSON.parse(file)

	switch(fn)
	{
		case 'insert':
			userId = process.argv[4] || 0
			draftId = process.argv[5] || null

			insertNewDraft(userId, json, draftId)
			.then( (newDraft) => {
				console.log('OK');
				process.exit()
				return
			})
			.catch(err => {
				console.error(err.message)
				process.exit(1)
				return
			})
			break;
		
		case 'update':
			draftId = process.argv[4] || 0

			updateDraft(draftId, json)
			.then( id => {
				console.log('OK. id=' + id)
				process.exit()
				return
			})
			.catch(err => {
				console.error(err.message)
				process.exit(1)
				return
			})
			break;
		
		default:
			throw usageError
			break
	}
}
catch(e)
{
	console.log('erroror')
	console.error(e.message);
	process.exit(1);
}