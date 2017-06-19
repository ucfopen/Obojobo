var express = require('express');
var router = express.Router();
let DraftModel = oboRequire('models/draft')

// TODO: Set up the package.json for this similar to the way docengine
// is set up. Clone, link, etc.
const xmlToDraftObject = require('oboxml/xml-to-draft-object')

var db = require('../../db')

let insertNewDraft = require('./drafts/insert_new_draft')
let updateDraft = require('./drafts/update_draft')

router.get('/:draftId', (req, res, next) => {
	let draftId = req.params.draftId

	return DraftModel.fetchById(draftId)
	.then(draftTree => {
		draftTree.root.yell('internal:sendToClient', req, res)
		res.success(draftTree.document)
		return next()
	})
	.catch(err => {
		console.error(err)
		res.missing('Draft not found')
		next(err)
		return Promise.reject(err)
	})
});

//@TODO - Transactionify this
router.post('/new', (req, res, next) => {
	let newDraft = null
	let user = null

	return req.requireCurrentUser()
	.then(currentUser => {
		user = currentUser
		if(!currentUser.canCreateDrafts) throw 'Insufficent permissions'

		return db.none(`BEGIN`)
	})
	.then(() => {
		return insertNewDraft(user.id)
	})
	.then(newDraft => {
		res.success(newDraft)
		return next()
	})
	.catch(err => {
		res.unexpected(err)
		next(err)
		return Promise.reject(err)
	})
})

//@TODO - Ensure that you can't post to a deleted draft, ensure you can only delete your own stuff
router.post(/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})/, (req, res, next) => {
	// TODO: This breaks a few tests, 'content', TypeError on 'content' as well as 'json'.
	let reqInput
	if (req.body) {
		try {
			reqInput = JSON.parse(req.body.content || req.body)
		}
		catch(e) {
			console.log("Input was not proper JSON formatting, " + e + ", Trying Obojobo XML ...")
			reqInput = req.body
			const convertedXml = xmlToDraftObject(reqInput.content)
			if (typeof convertedXml !== 'undefined') {
				// TODO: Case where XML was properly converted.
				console.log(convertedXml)
			} else {
				res.statusMessage = "Input matches neither JSON nor Obojobo XML format."
				return res.status(400).send()
			}
		}
	}

	return req.requireCurrentUser()
	.then(currentUser => {
		if(!currentUser.canEditDrafts) throw 'Insufficent permissions'

		return updateDraft(req.params[0], reqInput)
	})
	.then(id => {
		console.log('done')
		res.success({ id })
		return next()
	})
	.catch(error => {
		console.log(error)
		res.unexpected(error)
		next(error)
		return Promise.reject(error)
	})
});

router.delete('/:draftId', (req, res, next) => {
	return req.requireCurrentUser()
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
	.then(id => {
		res.success(id)
		return next()
	})
	.catch(err => {
		res.unexpected(err)
		next(err)
		return Promise.reject(err)
	})
});

router.get('/', (req, res, next) => {
	return req.requireCurrentUser()
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
		`, {userId: currentUser.id})
	})
	.then(result => {
		res.success(result)
		return next()
	})
	.catch(err => {
		console.log(err)
		res.unexpected(err)
		next(err)
		return Promise.reject(err)
	})
});

module.exports = router;
