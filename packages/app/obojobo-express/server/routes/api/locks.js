const express = require('express')
const logger = oboRequire('server/logger')
const router = express.Router()
const EditLock = oboRequire('server/models/edit_lock')
const DraftPermissions = require('obojobo-repository/server/models/draft_permissions')
const { checkValidationRules, requireDraftId, requireContentId, requireCanViewEditor } = oboRequire(
	'server/express_validators'
)

// CHECK A LOCK
// mounted as /api/locks/:draftId
router
	.route('/:draftId')
	.get([requireDraftId, requireCanViewEditor, checkValidationRules])
	.get(async (req, res) => {
		const existingLock = await EditLock.fetchByDraftId(req.params.draftId)
		res.success(existingLock)
	})

// CREATE A LOCK
// mounted as /api/locks/:draftId
router
	.route('/:draftId')
	.post([requireDraftId, requireCanViewEditor, requireContentId, checkValidationRules])
	.post(async (req, res) => {
		try {
			const access_level = await DraftPermissions.getUserAccessLevelToDraft(
				req.currentUser.id,
				req.params.draftId
			)

			const hasPerms = access_level === 'Full' || access_level === 'Partial'

			if (!hasPerms) {
				return res.notAuthorized('You do not have the required access to edit this module.')
			}

			// attempt to lock
			// create won't overwrite existing valid locks owned by other users
			const myLock = await EditLock.create(
				req.currentUser.id,
				req.params.draftId,
				req.body.contentId
			)
			// send response to user
			if (!myLock || myLock.userId !== req.currentUser.id) {
				return res.notAuthorized('Someone else is currently editing this module.')
			}

			res.success()

			// let's go ahead and clean the locks after returning the result to the user
			// this isn't necissary for functionality (expired locks don't affect new locks)
			// it's just housekeeping.
			EditLock.deleteExpiredLocks()
		} catch (e) {
			logger.error(e)

			switch (e.message) {
				case 'Current version of draft does not match requested lock.':
					res.reject('Draft has been updated by someone else.')
					break

				default:
					res.unexpected('Unexpected error while creating edit lock.')
					break
			}
		}
	})

// DELETE MY LOCK
// would like to use delete method, but were relying on navigator.sendBeacon which is only post
// mounted as /api/locks/:draftId/delete
router
	.route('/:draftId/delete')
	.post([requireDraftId, requireCanViewEditor, checkValidationRules])
	.post(async (req, res) => {
		EditLock.deleteByDraftIdAndUser(req.currentUser.id, req.params.draftId)
		res.success()
	})

module.exports = router
