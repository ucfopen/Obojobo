var express = require('express');
var app = express();
let DraftModel = oboRequire('models/draft')

var db = require('../../db.js')

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
	req.requireCurrentUser()
	.then(currentUser => {
		if(!currentUser.canCreateDrafts) throw 'Insufficent permissions'

		return db.one(`
			INSERT INTO drafts(
				user_id
			)
			VALUES(
				$[userId]
			)
			RETURNING id
		`, {
			userId: currentUser.id
		})
	})
	.then( (result) => {
		return db.one(`
			INSERT INTO drafts_content(
				draft_id,
				content
			)
			VALUES(
				$[draftId],
				'{}'
			)
			RETURNING id
		`, {
			draftId: result.id
		})
	})
	.then( (result) => {
		res.success(result)
		next()
	})
	.catch(err => {
		next()
		return Promise.reject(err)
	})
})

//@TODO - Ensure that you can't post to a deleted draft, ensure you can only delete your own stuff
app.post(/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})/, (req, res, next) => {
	req.requireCurrentUser()
	.then(currentUser => {
		if(!currentUser.canEditDrafts) throw 'Insufficent permissions'

		return db.one(`
			INSERT INTO drafts_content(
				draft_id,
				content
			)
			VALUES(
				$[draftId],
				$[content]
			)
			RETURNING id
		`, {
			draftId: req.params[0],
			content: req.body
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

		db.any(`
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
		res.success(result)
	})
});

module.exports = app;
