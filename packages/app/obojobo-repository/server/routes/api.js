const router = require('express').Router()
const RepositoryGroup = require('../models/group')
const DraftSummary = require('../models/draft_summary')
const { requireCanViewDrafts, requireCurrentUser, requireCurrentDocument } = require('obojobo-express/express_validators')
const UserModel = require('obojobo-express/models/user')
const DraftModel = require('obojobo-express/models/draft')
const db = require('obojobo-express/db')
const oboEvents = require('obojobo-express/obo_events')
const logger = require('obojobo-express/logger')

// when a new draft is created make sure we create an ownership association
oboEvents.on(DraftModel.EVENT_NEW_DRAFT_CREATED, (newDraft) => {
	return db
		.none(`
			INSERT INTO repository_map_user_to_draft
			(draft_id, user_id)
			VALUES($[draftId], $[userId])
			ON CONFLICT DO NOTHING
			`, {userId: newDraft.user_id, draftId: newDraft.id})
		.catch(logger.error)
})

// when a draft is deleted, remove all of it's permissions
oboEvents.on(DraftModel.EVENT_DRAFT_DELETED, ({id}) => {
	// remove all permissions for all deleted drafts
	return db
		.none(`
			DELETE FROM repository_map_user_to_draft
			USING drafts
			WHERE
			drafts.id = repository_map_user_to_draft.draft_id
			AND
			drafts.deleted = TRUE`)
		.catch(logger.error)
})

const resultsToUsers = results => {
	return results
		.map(u => {
			return new UserModel({
				id: u.id,
				firstName: u.first_name,
				lastName: u.last_name,
				email: u.email,
				username: u.username,
				createdAt: u.created_at,
				roles: u.roles
			})
		})
}

// List public drafts
router
	.route('/drafts-public')
	.get((req, res) => {
		const publicLibGroupId = '00000000-0000-0000-0000-000000000000'
		return RepositoryGroup
			.fetchById(publicLibGroupId)
			.then(group => group.loadRelatedDrafts())
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
			.fetchByUserId(req.currentUser.id)
			.then(res.success)
			.catch(res.unexpected)
	})

router
	.route('/users/search')
	.get([requireCurrentUser, requireCanViewDrafts])
	.get((req, res) => {
		if(!req.query.q || !req.query.q.trim()){
			res.success([])
			return
		}
		const search = `%${req.query.q}%`
		return db
			.none(`CREATE OR REPLACE FUNCTION obo_immutable_concat_ws(s text, t1 text, t2 text)
				RETURNS text AS
				$func$
				SELECT concat_ws(s, t1, t2)
				$func$ LANGUAGE sql IMMUTABLE;

				`)
			.then(() => {
				return db.manyOrNone(`SELECT * FROM users WHERE obo_immutable_concat_ws(' ', first_name, last_name) ILIKE $[search] OR email ILIKE $[search] OR username ILIKE $[search] ORDER BY first_name, last_name LIMIT 25`, {search})
			})
			.then(searchResults => {
				res.success(resultsToUsers(searchResults))
			})
			.catch(res.unexpected)
	})


// list a draft's permissions
router
	.route('/drafts/:draftId/permission')
	.get([requireCurrentUser, requireCurrentDocument, requireCanViewDrafts])
	.get((req, res) => {
		return db
			.manyOrNone(`SELECT users.* FROM repository_map_user_to_draft JOIN users ON users.id = user_id WHERE draft_id = $[draft_id] ORDER BY users.first_name, users.last_name`, {draft_id: req.params.draftId})
			.then(permsResult => {
				res.success(resultsToUsers(permsResult))
			})
			.catch(res.unexpected)
	})

// add a permission for a user to a draft
// @TODO: make sure the user adding the permission has permission
// @TODO: make sure the user being added exists
router
	.route('/drafts/:draftId/permission')
	.post([requireCurrentUser, requireCurrentDocument, /*requireCanViewDrafts*/])
	.post((req, res) => {
		return Promise.resolve()
			.then(() => {
				const userId = req.body.userId
				const draftId = req.currentDocument.draftId
				return db.none(`INSERT INTO repository_map_user_to_draft (draft_id, user_id) VALUES($[draftId], $[userId]) ON CONFLICT DO NOTHING`, {userId, draftId})
			})
			.then(insertPermResult => {res.success()})
			.catch(res.unexpected)
	})

// delete a permission for a user to a draft
// @TODO: make sure the user removing the permission has permission
router
	.route('/drafts/:draftId/permission/:userId')
	.delete([requireCurrentUser, requireCurrentDocument, /*requireCanViewDrafts*/])
	.delete((req, res) => {
		return UserModel.fetchById(req.params.userId)
			.then(user => {
				const userId = user.id
				const draftId = req.currentDocument.draftId
				console.log(`DELETE FROM repository_map_user_to_draft WHERE draft_id = $[draftId] AND user_id = $[userId]`)
				console.log(userId, draftId)
				return db.none(`DELETE FROM repository_map_user_to_draft WHERE draft_id = $[draftId] AND user_id = $[userId]`, {userId, draftId})
			})
			.then(insertPermResult => {res.success()})
			.catch(res.unexpected)
	})

module.exports = router
