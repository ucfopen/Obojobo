const express = require('express')
const router = express.Router()
const db = oboRequire('db')
let DraftModel = oboRequire('models/draft')

router.post('/start', (req, res, next) => {
	let user, visitId
	let resultContainer = {
		attemptHistory: []
	}
	return req
		.requireCurrentUser()
		.then(userFromReq => {
			user = userFromReq
			visitId = req.body.visitId
			return db.one(
				`
				SELECT id, is_active
				FROM visits
				WHERE id = $[visitId]
				AND user_id = $[userId]
				AND is_active = true
				ORDER BY created_at DESC
				LIMIT 1
			`,
				{
					visitId,
					userId: user.id
				}
			)
		})
		.then(() => {
			return DraftModel.fetchById(req.body.draftId)
		})
		.then(draft => {
			return draft.yell('internal:startVisit', req, res, resultContainer)
		})
		.then(() => {
			res.success({
				visitId,
				isPreviewing: user.canViewEditor,
				attemptHistory: resultContainer.attemptHistory
			})
		})
		.catch(err => {
			res.reject(err)
		})
})

module.exports = router
