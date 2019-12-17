const router = require('express').Router() //eslint-disable-line new-cap
const RepositoryCollection = require('../models/collection')
const Draft = require('obojobo-express/models/draft')
const DraftSummary = require('../models/draft_summary')
const DraftsMetadata = require('../models/drafts_metadata')
const {
	requireCanPreviewDrafts,
	requireCurrentUser,
	requireCurrentDocument
} = require('obojobo-express/express_validators')
const UserModel = require('obojobo-express/models/user')
const { searchForUserByString } = require('../services/search')
const {
	addUserPermissionToDraft,
	userHasPermissionToDraft,
	fetchAllUsersWithPermissionToDraft,
	removeUserPermissionToDraft,
	userHasPermissionToCopy
} = require('../services/permissions')
const publicLibCollectionId = '00000000-0000-0000-0000-000000000000'

// List public drafts
router.route('/drafts-public').get((req, res) => {
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
	.get(async (req, res) => {
		// empty search string? return empty array
		if (!req.query.q || !req.query.q.trim()) {
			res.success([])
			return
		}

		try {
			const users = await searchForUserByString(req.query.q)
			res.success(users)
		} catch (error) {
			res.unexpected(error)
		}
	})

// Copy a public draft to current user
// mounted as /api/drafts/:draftId/copy/
router
	.route('/drafts/:draftId/copy/')
	.post([requireCanPreviewDrafts, requireCurrentUser])
	.post(async (req, res) => {
		try {
			const userId = req.currentUser.id
			const draftId = req.params.draftId

			const canCopy = await userHasPermissionToCopy(userId, draftId)
			if (!canCopy) {
				res.notAuthorized('Current user has no permissions to copy draft')
				return
			}

			const oldDraft = await Draft.fetchById(draftId)
			const newDraft = await Draft.createWithContent(userId, oldDraft.root.toObject())

			const draftMetadata = new DraftsMetadata({
				draft_id: newDraft.id,
				key: 'copied',
				value: draftId
			})
			await draftMetadata.saveOrCreate()

			res.success()
		} catch (e) {
			res.unexpected(e)
		}
	})

// list a draft's permissions
router
	.route('/drafts/:draftId/permission')
	.get([requireCurrentUser, requireCurrentDocument, requireCanPreviewDrafts])
	.get((req, res) => {
		return fetchAllUsersWithPermissionToDraft(req.params.draftId)
			.then(res.success)
			.catch(res.unexpected)
	})

// add a permission for a user to a draft
router
	.route('/drafts/:draftId/permission')
	.post([requireCurrentUser, requireCurrentDocument])
	.post(async (req, res) => {
		try {
			const userId = req.body.userId
			const draftId = req.currentDocument.draftId

			// check currentUser's permissions
			const canShare = await userHasPermissionToDraft(req.currentUser.id, draftId)
			if (!canShare) {
				res.notAuthorized('Current User has no permissions to selected draft')
				return
			}

			// make sure the target userId exists
			// fetchById will throw if not found
			await UserModel.fetchById(userId)

			// add permissions
			await addUserPermissionToDraft(userId, draftId)
			res.success()
		} catch (error) {
			res.unexpected(error)
		}
	})

// delete a permission for a user to a draft
router
	.route('/drafts/:draftId/permission/:userId')
	.delete([requireCurrentUser, requireCurrentDocument])
	.delete(async (req, res) => {
		try {
			const userIdToRemove = req.params.userId
			const draftId = req.currentDocument.draftId

			// check currentUser's permissions
			const canShare = await userHasPermissionToDraft(req.currentUser.id, draftId)
			if (!canShare) {
				res.notAuthorized('Current User has no permissions to selected draft')
				return
			}

			// make sure the userToRemove exists
			// fetchById throws when not found
			const userToRemove = await UserModel.fetchById(userIdToRemove)

			// remove perms
			await removeUserPermissionToDraft(userToRemove.id, draftId)
			res.success()
		} catch (error) {
			res.unexpected(error)
		}
	})

module.exports = router
