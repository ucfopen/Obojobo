const router = require('express').Router()
const RepositoryGroup = require('../models/group')
const DraftSummary = require('../models/draft_summary')
const { requireCanViewDrafts, requireCurrentUser, requireCurrentDocument } = require('obojobo-express/express_validators')

const db = require('obojobo-express/db')

// List public drafts
router
	.route('/drafts-public')
	.get((req, res) => {
		const publicLibGroupId = '00000000-0000-0000-0000-000000000000'
		return RepositoryGroup
			.fetchById(publicLibGroupId)
			.then(group => {
				return group.loadRelatedDrafts()
			})
			.then(group => {
				res.success(group.drafts)
			})
			.catch(res.unexpected)
	})

// List my drafts
// mounted as /api/drafts
router
	.route('/drafts')
	.get([requireCurrentUser, requireCanViewDrafts])
	.get((req, res) => {
		return DraftSummary
			.fetchWhere(`drafts.user_id = $[userId]`, { userId: req.currentUser.id })
			.then(res.success)
			.catch(res.unexpected)
	})

router
	.route('/users/search')
	.get([requireCurrentUser, requireCanViewDrafts])
	.get((req, res) => {
		const search = `%${req.query.search}%`
		console.log(search)
		return db
			.none(`CREATE OR REPLACE FUNCTION obo_immutable_concat_ws(s text, t1 text, t2 text)
				RETURNS text AS
				$func$
				SELECT concat_ws(s, t1, t2)
				$func$ LANGUAGE sql IMMUTABLE;

				`)
			.then(() => {
				return db.manyOrNone(`SELECT id, username, email, first_name, last_name, roles FROM users WHERE obo_immutable_concat_ws(' ', first_name, last_name) ILIKE $[search] OR email ILIKE $[search] OR username ILIKE $[search] LIMIT 25`, {search})
			})
			.then(searchResults => {
				res.success(searchResults)
			})
	})


// list a draft's permissions
router
	.route('/drafts/:draftId/permission')
	.get([requireCurrentUser, requireCurrentDocument, requireCanViewDrafts])
	.get((req, res) => {
		return db
			.manyOrNone(`SELECT user_id, username, email, first_name, last_name, roles FROM repository_map_user_to_draft JOIN users ON users.id = user_id WHERE draft_id = $[draft_id]`, {draft_id: req.params.draftId})
			.then(permsResult => {
				res.success(permsResult)
			})
	})

// add a permission for a user to a draft
// @TODO: make sure the user adding the permission has permission
// @TODO: make sure the user being added exists
router
	.route('/drafts/:draftId/permission')
	.post([requireCurrentUser, requireCurrentDocument, requireCanViewDrafts])
	.post((req, res) => {
		const userId = req.query.user_id
		const draftId = req.currentDocument.draftId
		return db
			one(`INSERT INTO repository_map_user_to_draft (draft_id, user_id) VALUES($[draftId], $[userId])`, {userId, draftId})
			.then(insertPermResult => {
				res.success()
			})
			.catch(error => {
				res.reject()
			})
	})

// delete a permission for a user to a draft
// @TODO: make sure the user removing the permission has permission
router
	.route('/drafts/:draftId/permission')
	.delete([requireCurrentUser, requireCanViewDrafts])
	.delete((req, res) => {
		const userId = req.query.user_id
		const draftId = req.currentDocument.draftId
		return db
			one(`DELETE FROM repository_map_user_to_draft WHERE draft_id = $[draftId] AND user_id = $[userId])`, {userId, draftId})
			.then(insertPermResult => {
				res.success()
			})
			.catch(error => {
				res.reject()
			})
	})

module.exports = router
