const express = require('express')
const router = express.Router()
const EditLock = oboRequire('models/edit_lock')
const { userHasPermissionToDraft } = require('obojobo-repository/server/services/permissions')
const { checkValidationRules, requireDraftId, requireCanViewEditor } = oboRequire(
	'express_validators'
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
// // mounted as /api/locks/:draftId
router
	.route('/:draftId')
	.post([requireDraftId, requireCanViewEditor, checkValidationRules])
	.post(async (req, res) => {
		try {
			const hasPerms = await userHasPermissionToDraft(req.currentUser.id, req.params.draftId)

			if (!hasPerms) {
				return res.notAuthorized('Authoring permissions required to create a lock.')
			}

			const existingLock = await EditLock.fetchByDraftId(req.params.draftId)
			if (existingLock && existingLock.userId !== req.currentUser.id) {
				return res.notAuthorized('Draft is already locked by someone else.')
			}

			const myLock = await EditLock.create(req.currentUser.id, req.params.draftId)

			if (myLock.userId === req.currentUser.id) {
				res.success()
			} else {
				res.notAuthorized()
			}

			// let's go ahead and clean the locks after returning the result to the user
			EditLock.deleteExpiredLocks()
		} catch (e) {
			res.unexpected(e)
		}
	})

module.exports = router
