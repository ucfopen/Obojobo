const express = require('express')
const router = express.Router()
const db = oboRequire('db')
const logger = oboRequire('logger')
const DraftModel = oboRequire('models/draft')
const ltiUtil = oboRequire('lti')

router.post('/start', (req, res, next) => {
	let user
	let visitId
	let ltiOutcomeServiceUrl
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
			return ltiUtil.retrieveLtiLaunch(user.id, req.body.draftId, 'START_VISIT_API')
		})
		.then(launch => {
			ltiOutcomeServiceUrl = launch.reqVars.lis_outcome_service_url
			return DraftModel.fetchById(req.body.draftId)
		})
		.then(draft => {
			return draft.yell('internal:startVisit', req, res, resultContainer)
		})
		.then(() => {
			res.success({
				visitId,
				isPreviewing: user.canViewEditor,
				lti: {
					lis_outcome_service_url: ltiOutcomeServiceUrl
				},
				attemptHistory: resultContainer.attemptHistory
			})
		})
		.catch(err => {
			logger.error(err)
			res.reject(err)
		})
})

module.exports = router
