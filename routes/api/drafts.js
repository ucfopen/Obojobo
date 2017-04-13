var express = require('express');
var app = express();
let DraftModel = oboRequire('models/draft')

var db = require('../../db')

let insertNewDraft = require('./drafts/insert_new_draft')
let updateDraft = require('./drafts/update_draft')

app.get('/:draftId', (req, res, next) => {
	let draftId = req.params.draftId

	DraftModel.fetchById(draftId)
	.then(draftTree => {
		draftTree.root.yell('internal:sendToClient', req, res)
		res.success(draftTree.document)
		next()
	})
	.catch(error => {
		console.error('e', error)
		res.missing('Draft not found')
		next()
	})
});

//@TODO - Transactionify this
app.post('/new', (req, res, next) => {
	let newDraft = null
	let user = null

	req.requireCurrentUser()
	.then(currentUser => {
		user = currentUser
		if(!currentUser.canCreateDrafts) throw 'Insufficent permissions'

		return db.none(`BEGIN`)
	})
	.then( () => {
		return insertNewDraft(user.id)
	})
	.then( (newDraft) => {
		res.success(newDraft)
		next()
	})
	.catch(err => {
		res.unexpected(error)
		next()
	})
})

//@TODO - Ensure that you can't post to a deleted draft, ensure you can only delete your own stuff
app.post(/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})/, (req, res, next) => {
	req.requireCurrentUser()
	.then(currentUser => {
		if(!currentUser.canEditDrafts) throw 'Insufficent permissions'

		return updateDraft(req.params[0], req.body)
	})
	.then( id => {
		res.success({ id:id })
		next()
	})
	.catch(error => {
		res.unexpected(error)
		next()
	})
});

app.delete('/:draftId', (req, res, next) => {
	req.requireCurrentUser()
	.then(currentUser => {
		if(!currentUser.canDeleteDrafts) throw 'Insufficent permissions'

		return db.none(`
			UPDATE drafts
			SET deleted = TRUE
			WHERE id = $[draftId]
			AND user_id = $[userId]
		`, {
			draftId: req.params.draftId,
			userId: currentUser.id
		})
	})
	.then( id => {
		res.success(id)
		next()
	})
	.catch(error => {
		res.unexpected(error)
		next()
	})
});

app.get('/', (req, res, next) => {
	req.requireCurrentUser()
	.then(currentUser => {
		if(!currentUser.canViewDrafts) throw 'Insufficent permissions'

		return db.any(`
			SELECT DISTINCT ON (draft_id)
				draft_id AS "draftId",
				id AS "latestVersion",
				created_at AS "createdAt",
				content
			FROM drafts_content
			WHERE draft_id IN (
				SELECT id
				FROM drafts
				WHERE deleted = FALSE
				AND user_id = $[userId]
			)
			ORDER BY draft_id, id desc
		`, {
			userId: currentUser.id
		})
	})
	.then( (result) => {
		console.log('DEM RESULTS', result)
		res.success(result)
	})
	.catch(error => {
		res.unexpected(error)
		next()
	})
});

module.exports = app;
