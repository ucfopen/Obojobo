const express = require('express')
const router = express.Router()
const db = oboRequire('db')
const logger = oboRequire('logger')
const DraftModel = oboRequire('models/draft')
const ltiUtil = oboRequire('lti')
const viewerState = oboRequire('viewer/viewer_state')

const getVisit = (visitId, userId) => {
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
			userId
		}
	)
}

const getDraftAndStartVisitProps = (req, res) => {
	let draft
	let visitStartReturnExtensionsProps = {}

	return DraftModel.fetchById(req.body.draftId)
		.then(draftResult => {
			draft = draftResult

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
			return {
				draft,
				visitStartReturnExtensionsProps
			}
		})
}

const getViewerState = (userId, draftId) => {
	return viewerState.get(userId, draftId)
}

// Start a new visit
// mounted as /api/visit/start
router.post('/start', (req, res, next) => {
	let user
	let visit
	let draft
	let viewState
	let visitStartReturnExtensionsProps

	let visitId = req.body.visitId
	let draftId = req.body.draftId

	logger.log(`VISIT: Begin start visit for visitId="${visitId}", draftId="${draftId}"`)

	return req
		.requireCurrentUser()
		.then(userFromReq => {
			user = userFromReq

			if (visitId == null || draftId == null) throw new Error('Missing visit and/or draft id!')

			return Promise.all([
				getVisit(visitId, user.id),
				getViewerState(user.id, draftId),
				getDraftAndStartVisitProps(req, res)
			])
		})
		.then(results => {
			;[visit, viewState, { draft, visitStartReturnExtensionsProps }] = results

			if (visit.draft_content_id !== draft.root.node._rev) {
				throw new Error('Visit for older draft version!')
			}

			if (visit.preview !== true) {
				return ltiUtil.retrieveLtiLaunch(user.id, draftId, 'START_VISIT_API')
			}
		})
		.then(launch => {
			logger.log(
				`VISIT: Start visit success for visitId="${visitId}", draftId="${draftId}", userId="${user.id}"`
			)

			res.success({
				visitId: visitId,
				isPreviewing: user.canViewEditor ? user.canViewEditor : false, //@TODO: This should be if visit.preview === true but we can't do that until the rest of the code uses visit.preview instead of user.canViewEditor
				lti: {
					lis_outcome_service_url: visit.preview ? null : launch.reqVars.lis_outcome_service_url
				},
				viewState,
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
