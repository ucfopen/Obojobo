const express = require('express')
const router = express.Router()
const db = oboRequire('db')
const logger = oboRequire('logger')
const DraftModel = oboRequire('models/draft')
const ltiUtil = oboRequire('lti')
const viewerState = oboRequire('viewer/viewer_state')

router.post('/start', (req, res, next) => {
	let user
	let visit
	let isPreviewVisit
	let viewerStateData = null
	let ltiOutcomeServiceUrl = null
	let visitStartReturnExtensionsProps = {}

	return req
		.requireCurrentUser()
		.then(userFromReq => {
			let visitId = req.body.visitId

			user = userFromReq

			// get visit
			return db.one(
				`
				SELECT is_active, preview, draft_content_id
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
		.then(visitResult => {
			visit = visitResult
			isPreviewVisit = visit.preview === true

			if (!isPreviewVisit) {
				return ltiUtil.retrieveLtiLaunch(user.id, req.body.draftId, 'START_VISIT_API')
			}
		})
		.then(launch => {
			if (!isPreviewVisit) {
				ltiOutcomeServiceUrl = launch.reqVars.lis_outcome_service_url
			}

			return viewerState.get(user.id, req.body.draftId)
		})
		.then(viewerStateForDraft => {
			viewerStateData = viewerStateForDraft

			return DraftModel.fetchById(req.body.draftId)
		})
		.then(draft => {
			if (visit.draft_content_id !== draft.root.node._rev) {
				throw new Error('Visit for older draft version!')
			}

			return draft.yell(
				'internal:startVisit',
				req,
				res,
				req.body.draftId,
				req.body.visitId,
				visitStartReturnExtensionsProps
			)
		})
		.then(() => {
			res.success({
				visitId: req.body.visitId,
				isPreviewing: user.canViewEditor ? user.canViewEditor : false,
				lti: {
					lis_outcome_service_url: ltiOutcomeServiceUrl
				},
				viewState: viewerStateData,
				extensions: visitStartReturnExtensionsProps
			})
		})
		.catch(err => {
			logger.error(err)
			if (err instanceof Error) {
				err = err.message
			}
			res.reject(err)
		})
})

module.exports = router
