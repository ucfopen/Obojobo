const router = require('express').Router() //eslint-disable-line new-cap
const RepositoryCollection = require('../models/collection')
const DraftSummary = require('../models/draft_summary')
const DraftPermissions = require('../models/draft_permissions')
const {
	requireCanPreviewDrafts,
	requireCurrentUser,
	requireCurrentDocument
} = require('obojobo-express/express_validators')
const UserModel = require('obojobo-express/models/user')
const db = require('obojobo-express/db')

// List public drafts
router.route('/drafts-public').get((req, res) => {
	const publicLibCollectionId = '00000000-0000-0000-0000-000000000000'
	return RepositoryCollection.fetchById(publicLibCollectionId)
		.then(collection => collection.loadRelatedDrafts())
		.then(collection => {
			res.success(collection.drafts)
		})
		.catch(res.unexpected)
})

// List my drafts
// mounted as /api/drafts
router
	.route('/drafts')
	.get([requireCurrentUser, requireCanPreviewDrafts])
	.get((req, res) => {
		return DraftSummary.fetchByUserId(req.currentUser.id)
			.then(res.success)
			.catch(res.unexpected)
	})

router
	.route('/users/search')
	.get([requireCurrentUser, requireCanPreviewDrafts])
	.get((req, res) => {
		if (!req.query.q || !req.query.q.trim()) {
			res.success([])
			return
		}

		const search = `%${req.query.q}%`
		return UserModel.searchForUsers(search)
			.then(res.success)
			.catch(res.unexpected)
	})

// list a draft's permissions
router
	.route('/drafts/:draftId/permission')
	.get([requireCurrentUser, requireCurrentDocument, requireCanPreviewDrafts])
	.get((req, res) => {
		return DraftPermissions.getDraftOwners(req.params.draftId)
			.then(res.success)
			.catch(res.unexpected)
	})

// add a permission for a user to a draft
// @TODO: make sure the user adding the permission has permission
// @TODO: make sure the user being added exists
router
	.route('/drafts/:draftId/permission')
	.post([requireCurrentUser, requireCurrentDocument /*requireCanPreviewDrafts*/])
	.post((req, res) => {
		return UserModel.fetchById(req.body.userId)
			.then(userToAdd => DraftPermissions.addOwnerToDraft(req.currentDocument.draftId, userToAdd.id))
			.then(() => {
				res.success()
			})
			.catch(res.unexpected)
	})

// delete a permission for a user to a draft
// @TODO: make sure the user removing the permission has permission
router
	.route('/drafts/:draftId/permission/:userId')
	.delete([requireCurrentUser, requireCurrentDocument /*requireCanPreviewDrafts*/])
	.delete((req, res) => {
		return UserModel.fetchById(req.params.userId)
			.then(userToRemove => DraftPermissions.removeOwnerFromDraft(req.currentDocument.draftId, userToRemove.id))
			.then(() => {
				res.success()
			})
			.catch(res.unexpected)
	})

module.exports = router
